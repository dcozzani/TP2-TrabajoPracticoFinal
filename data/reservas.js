import { getConnection } from './database'; // Asegúrate de ajustar la ruta según tu estructura de proyecto
import { ObjectId } from 'mongodb';

async function verificarReservasSuperpuestas(connectiondb, id, fechaInicio, fechaFin) {
  return await connectiondb
    .db(DATABASE)
    .collection("reservas")
    .find({
      airbnbId: new ObjectId(id),
      $or: [
        { fechaDesde: { $lt: fechaFin }, fechaHasta: { $gt: fechaInicio } }
      ]
    })
    .toArray();
}

export async function getReservaPorId(id) {
  const connectiondb = await getConnection();

  return await connectiondb
    .db(DATABASE)
    .collection("reservas")
    .findOne({ _id: new ObjectId(id) });
}	

export async function getReservasPorUsuario(usuario) {
  const connectiondb = await getConnection();

  return await connectiondb
    .db(DATABASE)
    .collection("reservas")
    .find({ usuario: usuario })
    .toArray();
}

export async function reservarAirbnb(id, usuario, fechaDesde, fechaHasta) {
  const connectiondb = await getConnection();

  if (!id || !usuario || !fechaDesde || !fechaHasta) {
    throw new Error("Todos los parámetros son obligatorios.");
  }
  if (new Date(fechaDesde) >= new Date(fechaHasta)) {
    throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
  }

  const fechaInicio = new Date(fechaDesde);
  const fechaFin = new Date(fechaHasta);

  const reservasSuperpuestas = await verificarReservasSuperpuestas(connectiondb, id, fechaInicio, fechaFin);

  if (reservasSuperpuestas.length > 0) {
    throw new Error("El Airbnb ya está reservado para las fechas seleccionadas.");
  }

  // Crear la nueva reserva
  const reserva = {
    usuario: usuario,
    fechaDesde: fechaInicio,
    fechaHasta: fechaFin,
    airbnbId: new ObjectId(id)
  };

  const result = await connectiondb
    .db(DATABASE)
    .collection("reservas")
    .insertOne(reserva);

  return result.insertedId;
}