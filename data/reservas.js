import getConnection from "./conn.js";
import { ObjectId } from 'mongodb';
import { getAirbnbPorId } from './airbnb.js';

const DATABASE = "sample_airbnb";
const RESERVAS = "reservas";

async function verificarReservasSuperpuestas(connectiondb, id, fechaInicio, fechaFin) {
  // valido que la fecha de inicio sea menor a la fecha de fin
  // sino las intercambio
  if (fechaInicio > fechaFin) {
    [fechaInicio, fechaFin] = [fechaFin, fechaInicio];
  }

  return await connectiondb
    .db(DATABASE)
    .collection(RESERVAS)
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
    .collection(RESERVAS)
    .findOne({ _id: new ObjectId(id) });
}	

export async function getReservasPorUsuario(usuario) {
  const connectiondb = await getConnection();

  return await connectiondb
    .db(DATABASE)
    .collection(RESERVAS)
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

  // Obtener los detalles del Airbnb
  const airbnb = await getAirbnbPorId(id);

  if (!airbnb) {
    throw new Error("El Airbnb especificado no existe.");
  }

  // Calcular la cantidad de noches - El resultado de la resta de las fechas lo devuelve
  // en milisegundos, por lo que se divide por la cantidad de milisegundos en un día
  const noches = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);

  // Verificar las restricciones de noches mínimas y máximas
  if (noches < airbnb.minimum_nights) {
    throw new Error(`La cantidad mínima de noches para reservar es ${airbnb.minimum_nights}.`);
  }
  if (noches > airbnb.maximum_nights) {
    throw new Error(`La cantidad máxima de noches para reservar es ${airbnb.maximum_nights}.`);
  }

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
    .collection(RESERVAS)
    .insertOne(reserva);

  return result.insertedId;
}


export async function listarReservasPorUsuario(usuarioId) {
  const connectiondb = await getConnection();

  const reservas = await connectiondb
    .db(DATABASE)
    .collection(RESERVAS)
    .find({ usuario: usuarioId })
    .toArray();

  if (reservas.length === 0) {
    return "No se encontraron reservas para el usuario especificado.";
  }

  return reservas;
}


export async function cancelarReserva(reservaId) {
  const connectiondb = await getConnection();

  const result = await connectiondb
    .db(DATABASE)
    .collection(RESERVAS)
    .deleteOne({ _id: new ObjectId(reservaId) });

  if (result.deletedCount === 0) {
    throw new Error("No se encontró la reserva o no se pudo cancelar.");
  }

  return "Reserva cancelada con éxito.";
}
