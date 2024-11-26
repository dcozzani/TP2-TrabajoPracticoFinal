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
        { _id: listingId }, // Buscar el documento por ID
        { $push: { reviews: newReview } } // Agregar el review al array embebido
      );
  
    if (result.modifiedCount === 0) {
      throw new Error("No se encontró el inmueble o no se pudo agregar el review.");
    }
  
    return newReview;
  }