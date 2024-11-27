import express from 'express';
import { reservarAirbnb, getReservasPorUsuario, verificarReservasSuperpuestas, getReservaPorId } from '../data/reservas';
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Ruta para crear una nueva reserva
router.post('/reservar', async (req, res) => {
  const { id, usuario, fechaDesde, fechaHasta } = req.body;
  try {
    const reservaId = await reservarAirbnb(id, usuario, fechaDesde, fechaHasta);
    res.status(201).json({ message: 'Reserva creada con éxito', reservaId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para listar reservas por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const reservas = await getReservasPorUsuario(usuarioId);
    if (reservas.length === 0) {
      res.status(404).json({ message: 'No se encontraron reservas para el usuario especificado.' });
    } else {
      res.status(200).json(reservas);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Ruta para obtener una reserva por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const reserva = await getReservaPorId(id);
    if (!reserva) {
      res.status(404).json({ message: 'Reserva no encontrada.' });
    } else {
      res.status(200).json(reserva);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;