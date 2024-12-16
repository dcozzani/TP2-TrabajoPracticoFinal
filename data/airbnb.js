import getConnection from "./conn.js";
import { ObjectId, Decimal128 } from "mongodb";

const DATABASE = process.env.DATABASE;
const LISTADOAIRBNB = process.env.LISTADOAIRBNB;

export async function getAllAirbnb(pageSize, page) {
    const connectiondb = await getConnection();
    const listadoAirbnb = await connectiondb
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .find({})
      .limit(pageSize)
      .skip(pageSize * page)
      .toArray();
    return listadoAirbnb;
  }

  export async function getAirbnbPorId(id) {
    const connectiondb = await getConnection();
  
    try {
  
      const airbnb = await connectiondb
        .db(DATABASE)
        .collection(LISTADOAIRBNB)
        .findOne({_id: id });
  
      return airbnb;
    } catch (error) {
      console.error("Error en getAirbnbPorId:", error);
      throw new Error("Error obteniendo el Airbnb por ID");
    }
  }
  
  
  
  export async function getAirbnbPorCountry(pais) {
    const connectiondb = await getConnection();
    const airbnbPais = await connectiondb
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .find({ "address.country": pais })
      .toArray();
    return airbnbPais
  }

  export async function addReview(listingId, review) {
    const clientMongo = await getConnection();
  
    // Formatear el nuevo review
    const newReview = {
      _id: new ObjectId().toString(), // Genera un nuevo ID único para el review
      date: new Date().toISOString(), // Fecha actual
      listing_id: listingId,
      reviewer_id: review.reviewer_id,
      reviewer_name: review.reviewer_name,
      comments: review.comments,
    };
  
    // Actualizar el documento correspondiente con el nuevo review
    const result = await clientMongo
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .updateOne(
        { _id: new ObjectId(listingId) },
        { 
          $push: { reviews: newReview } , // Agregar el review al array
          $set: { last_review: newReview.date } // Actualizar la fecha del último review
        } 

      );
  
    if (result.modifiedCount === 0) {
      throw new Error("No se encontró el inmueble o no se pudo agregar el review.");
    }
  
    return newReview;
  }

  export async function getAirbnbPorRangoDePrecio(precioDesde, precioHasta) {
    const connectiondb = await getConnection();

    // Validar que el orden de los parámetros sea correcto
  if (precioDesde > precioHasta) {
    throw new Error("El precioDesde debe ser menor o igual que el precioHasta.");
  }

    try {
      const airbnbs = await connectiondb
        .db(DATABASE)
        .collection(LISTADOAIRBNB)
        .find({
          price: { 
            // se agregar el cambio de tipo de dato por como esta en la base de datos
            $gte: Decimal128.fromString(precioDesde.toString()), 
            $lte: Decimal128.fromString(precioHasta.toString()) 
          }
        })
        .toArray();
  
      return { airbnbs };
    } catch (error) {
      console.error("Error en getAirbnbPorRangoDePrecio:", error);
      throw new Error("Error obteniendo los airbnb por rango de precio");
    }
  }

  export async function getReviewsPorAirbnb(listingId) {
    const connectiondb = await getConnection();
  
    // Buscar el listado de Airbnb por su ID y proyectar los campos necesarios
    const airbnb = await connectiondb
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .findOne(
        { _id: new ObjectId(listingId) },
        { projection: { reviews: 1, listing_url: 1, name: 1 } }
      );
  
    if (!airbnb) {
      throw new Error("El Airbnb especificado no existe.");
    }
  
    // Ordenar las reviews de la más nueva a la más vieja
    const reviewsOrdenadas = airbnb.reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // Armo la estructura a mostrar
    const response = {
      ID: airbnb._id,
      listing_url: airbnb.listing_url,
      name: airbnb.name,
      reviews: reviewsOrdenadas
    };
  
    return response;
  }