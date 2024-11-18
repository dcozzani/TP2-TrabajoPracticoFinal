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
