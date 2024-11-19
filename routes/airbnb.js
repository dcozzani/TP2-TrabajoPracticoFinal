import express from "express";
import { getAirbnbPorCountry, getAllAirbnb , getAirbnPorId} from "../data/airbnb.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
  const page = req.query.page ? parseInt(req.query.page) : 0;

  res.json(await getAllAirbnb(pageSize, page));
});


router.get("/country/:country", auth, async (req, res) => {
  try {   
    const airbnbs = await getAirbnbPorCountry(req.params.country);
    res.json(airbnbs);
  } catch (error) {
    res.status(500).send("Error obteniendo los airbnb por pais");
  }

})


router.get("/:id", async (req, res) => {
  try {
    const airbnb = await getAirbnPorId(req.params.id);
    if (airbnb) {
      res.json(airbnb);
    } else {
      res.status(404).send("No se encontro el Airbnb");
    }
  } catch (error) {
    res.status(500).send("Error obteniendo el Airbnb");
  }
});


export default router;