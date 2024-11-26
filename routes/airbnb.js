import express from "express";
import { getAirbnbPorCountry, getAllAirbnb , getAirbnbPorId} from "../data/airbnb.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllAirbnb(pageSize, page));
});


router.get("/country/:country", async (req, res) => {
  try {   
    const airbnbs = await getAirbnbPorCountry(req.params.country);
    res.json(airbnbs);
  } catch (error) {
    res.status(500).send("Error obteniendo los airbnb por pais");
  }

})


router.get("/:id", async (req, res) => {
  try {
    const airbnb = await getAirbnbPorId(req.params.id);
    if (airbnb) {
      res.json(airbnb);
    } else {
      res.status(404).send("No se encontro el Airbnb");
    }
  } catch (error) {
    res.status(500).send("Error obteniendo el Airbnb");
  }
});


router.post("/:id/reviews", auth, async (req, res) => {
  const listingId = req.params.id;
  const { reviewer_id, reviewer_name, comments } = req.body;

  try {
    // Validar los datos del review
    if (!reviewer_id || !reviewer_name || !comments) {
      return res.status(400).send("Todos los campos son obligatorios.");
    }

    // Llamar a la función para agregar el review
    const newReview = await addReview(listingId, {
      reviewer_id,
      reviewer_name,
      comments,
    });

    res.status(201).send(newReview);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default router;