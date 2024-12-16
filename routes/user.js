import express from "express";
import { addUser, findByCredentials, generateAuthToken, listarTodosLosUsuarios } from "../data/user.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validar los datos del usuario
    if (!email || !password ) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Llamar a la función para agregar el usuario
    const newUser = await addUser({ email, password});

    res.status(201).json({ message: 'Usuario agregado con éxito', newUser });
  } catch (error) {
    console.error("Error agregando el usuario:", error);
    res.status(500).send(error.message);
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("email", req.body.email);
    console.log("email", req.body.password);

    const user = await findByCredentials(req.body.email, req.body.password);
    console.log(user);
    const token = generateAuthToken(user);
    console.log(token);
    res.send({ user, token });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

router.get("/", async (req, res) => {
  try {
    const usuarios = await listarTodosLosUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error obteniendo los usuarios:", error);
    res.status(500).send(error.message);
  }
});

export default router;
