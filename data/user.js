import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const DATABASE = process.env.DATABASE;
const LISTADOUSUARIOS = process.env.LISTADOUSUARIOS;

export async function addUser(user) {
  const clientMongo = await getConnection();

  const existingUser = await clientMongo
    .db(DATABASE)
    .collection(LISTADOUSUARIOS)
    .findOne({ email: user.email });

  if (existingUser) {
    throw new Error("El correo electrónico ya está registrado.");
  }

  user.password = await bcryptjs.hash(user.password, 10);
  

  const result = clientMongo
    .db(DATABASE)
    .collection(LISTADOUSUARIOS)
    .insertOne(user);
  return result;
}

export async function listarTodosLosUsuarios() {
  const clientMongo = await getConnection();

  const usuarios = await clientMongo
    .db(DATABASE)
    .collection(LISTADOUSUARIOS)
    .find({})
    .toArray();

  return usuarios;
}

export async function findByCredentials(email, password) {
  const clientMongo = await getConnection();
  const user = await clientMongo
    .db(DATABASE)
    .collection(LISTADOUSUARIOS)
    .findOne({ email: email });

  console.log("Usuario:" + user);

  if (!user) {
    // para no revelar detalles de usuario
    throw new Error("Credenciales no validas");
  }

  const isMatch = await bcryptjs.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Credenciales no validas");
  }

  return user;
}

export function generateAuthToken(user) {
  const token = jwt.sign(
    { _id: user._id, email: user.email },
    process.env.SECRET,
    { expiresIn: "1h" }
  );

  return token;
}
