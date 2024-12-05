# TP2-TrabajoPracticoFinal

## Descripción

Este proyecto es una API para gestionar información relacionada con Airbnb, reservas y usuarios. 
Implementa una conexión con MongoDB y permite realizar operaciones como listar alojamientos, buscar por país, gestionar reservas, y autenticar usuarios.

## Endpoints  
### Airbnb  
**GET** /airbnb/  
Descripción: Lista todos los alojamientos.  
Query Params:  
pageSize (opcional): Tamaño de la página.  
page (opcional): Página actual.  
Respuesta: Lista de alojamientos.  
  
**GET** /airbnb/country/:country  
Descripción: Obtiene alojamientos en un país específico.  
Path Params:  
country: Nombre del país.  
Respuesta: Lista de alojamientos.  
  
**GET** /airbnb/:id  
Descripción: Obtiene información de un alojamiento por ID.  
Path Params:  
id: ID del alojamiento.  
Respuesta: Detalles del alojamiento. 
  
**POST** /airbnb/:id/addReview  
Descripción: Agrega una reseña a un alojamiento.  
Path Params:  
id: ID del alojamiento.  
Body:  
json  
{  
  "reviewer_id": "string",  
  "reviewer_name": "string",  
  "comments": "string"  
}  
Respuesta: Reseña agregada.  

### Reservas  
**POST** /reservas/reservar  
Descripción: Crea una nueva reserva.  
Body:  
json  
{  
  "id": "string",  
  "usuario": "string",  
  "fechaDesde": "YYYY-MM-DD",  
  "fechaHasta": "YYYY-MM-DD"  
}  
Respuesta: ID de la reserva creada. 
  
**GET** /reservas/usuario/:usuarioId  
Descripción: Lista reservas de un usuario específico.  
Path Params:  
usuarioId: ID del usuario.  
Respuesta: Lista de reservas.
  
**DELETE** /reservas/cancelar/:reservaId  
Descripción: Cancela una reserva.  
Path Params:  
reservaId: ID de la reserva.  
Respuesta: Mensaje de confirmación.  
  
### Usuarios  
**POST** /user/  
Descripción: Registra un nuevo usuario.  
Body:  
json  
{  
  "email": "string",  
  "password": "string"  
}  
Respuesta: Datos del usuario creado.  
  
**POST** /user/login  
Descripción: Autentica a un usuario.  
Body:  
json  
{  
  "email": "string",  
  "password": "string"  
} 
Respuesta: Token de autenticación.  

