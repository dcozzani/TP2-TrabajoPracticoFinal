import getConnection from "./conn.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const DATABASE = "sample_airbnb";
const LISTADOUSUARIOS = "users";

export async function addUser(user) {
  user.password = await bcryptjs.hash(user.password, 10);
  const clientMongo = await getConnection();

  const result = clientMongo
    .db(DATABASE)
    .collection(LISTADOUSUARIOS)
    .insertOne(user);
  return result;
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
