import getConnection from "./conn.js";
import { ObjectId } from "mongodb";
const DATABASE = "sample_airbnb";
const LISTADOAIRBNB = "listingsAndReviews";

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
    const airbnb = await connectiondb
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .findOne({ _id: new ObjectId(id) });
  
    return airbnb;
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

      // Valido que el orden de los parametros sea correcto
      // sino los intercambio
    if (precioDesde > precioHasta) {
      [precioDesde, precioHasta] = [precioHasta, precioDesde];
    }
  
    const airbnbs = await connectiondb
      .db(DATABASE)
      .collection(LISTADOAIRBNB)
      .find({
        price: { 
          $gte: Decimal128.fromString(precioDesde.toString()), 
          $lte: Decimal128.fromString(precioHasta.toString()) 
        }
      })
      .toArray();
  
    return airbnbs;
  }