import express from "express";
import { getAirbnbPorCountry, getAllAirbnb , getAirbnbPorId, addReview, getAirbnbPorRangoDePrecio, getReviewsPorAirbnb} from "../data/airbnb.js";
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

router.get("/price", async (req, res) => {
  const { precioDesde, precioHasta } = req.query;
  try {
    if (!precioDesde || !precioHasta) {
      return res.status(400).send("Debe proporcionar un precio inicial y un precio maximo.");
    }

    const airbnbs = await getAirbnbPorRangoDePrecio(precioDesde, precioHasta);
    res.status(200).json(airbnbs);
  } catch (error) {
    console.error("Error obteniendo los airbnb por rango de precio:", error);
    res.status(500).send(`Error obteniendo los airbnb por rango de precio: ${error.message}`);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const airbnb = await getAirbnbPorId(req.params.id);
    if (airbnb) {
      res.status(200).json(airbnb);
    } else {
      res.status(404).send("No se encontro el Airbnb");
    }
  } catch (error) {
    console.error("Error obteniendo el Airbnb:", error);
    res.status(500).send(`Error obteniendo el Airbnb: ${error.message}`);
  }
});


router.post("/:id/addReview", auth, async (req, res) => {
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

    res.status(201).json({ message: 'Review agregado con éxito', newReview });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get("/:id/reviews", async (req, res) => {
  const listingId = req.params.id;
  try {
    const reviews = await getReviewsPorAirbnb(listingId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


export default router;