import "dotenv/config";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB;
const client = new MongoClient(uri);

let instance = null;

export default async function getConnection() {
  if (instance == null) {
    try {
      instance = await client.connect();
      console.log("Conexión exitosa a MongoDB");  // Confirmación de conexión exitosa
    } catch (error) {
      console.error("Error de conexión a MongoDB:", error);  // Mostrar error completo
    }
  }
  return instance;
}