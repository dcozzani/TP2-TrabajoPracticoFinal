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
  
----------------------------------------------------------------------------------------------------------  

## Circuito de Pruebas para el Backend

---

### **1. Crear un usuario**
1. Abre Postman y crea una nueva petición.  
2. **Método**: `POST`  
3. **URL**: `http://localhost:3000/user/`  
4. **Body** (selecciona `raw` y `JSON`):  
   ```json
   {  
     "email": "usuario1@example.com",  
     "password": "contraseña123"  
   }  
Ejecuta la petición y verifica que el usuario se cree correctamente.  
### **2. Autenticar al usuario**  
**Método**: `POST`  
**URL**: `http://localhost:3000/user/login`  
**Body**:  
```json  
{  
  "email": "usuario1@example.com",  
  "password": "contraseña123"  
}  
Ejecuta la petición y copia el token del campo token en la respuesta.  
### **3. Buscar Airbnbs**  
**a. Listar todos los alojamientos**  
**Método**: `GET`  
**URL**: `http://localhost:3000/airbnb/`  
Query Params:  
pageSize=10  
page=0  
Ejecuta la petición y selecciona un alojamiento (id) para usarlo en los pasos siguientes.  
**b. Filtrar por país**  
**Método**: `GET`  
**URL**: `http://localhost:3000/airbnb/country/Argentina`  
Ejecuta la petición y valida los resultados.  
**c. Buscar por rango de precio**  
**Método**: `GET`  
**URL**: `http://localhost:3000/airbnb/price`  
Query Params:  
precioDesde=50  
precioHasta=200  
Ejecuta la petición.  
### **4. Agregar una reseña**  
**Método**: `POST`  
**URL**: `http://localhost:3000/airbnb/:id/addReview`  
Reemplazar :ID del alojamiento.  
**Headers**:  
**Authorization**: Bearer <token> (usa el token obtenido en el paso 2).  
**Body**:  
```json  
{  
  "reviewer_id": "12345",  
  "reviewer_name": "Usuario Prueba",  
  "comments": "Excelente lugar, muy limpio y bien ubicado."  
}  
Ejecuta la petición y verifica que la reseña se haya agregado.  
### **5. Reservar un Airbnb**   
**Método**: `POST`  
**URL**: `http://localhost:3000/reservas/reservar`  
**Headers**:  
**Authorization**: Bearer <token> (token obtenido en el paso 2).  
**Body**:  
```json  
{  
  "id": "<airbnbId>",  
  "usuario": "usuario1@example.com",  
  "fechaDesde": "2024-12-10",  
  "fechaHasta": "2024-12-15"  
}  
Ejecuta la petición y copia el ID de la reserva en la respuesta.  
### **6. Intentar reservar con otro usuario**  
**a. Crear un nuevo usuario**  
Repite los pasos 1 y 2 con el nuevo usuario:  
email: usuario2@example.com  
password: contraseña456  
**b. Intentar reservar las mismas fechas**  
Usa el endpoint POST /reservas/reservar con el token del segundo usuario y las mismas fechas que el primer usuario.  
Resultado esperado: El sistema debe rechazar la reserva porque las fechas se superponen.  
### **7. Cancelar una reserva**  
Autentica nuevamente al primer usuario (usuario1@example.com).  
**Método**: `DELETE`  
**URL**: `http://localhost:3000/reservas/cancelar/:reservaId`  
Reemplazar :reservaId con el ID de la reserva obtenida en el paso 5.  
**Headers**:  
**Authorization**: Bearer <token> (usa el token del usuario 1).  
Ejecuta la petición y valida que la reserva fue cancelada.  
### **8. Validar la cancelación**  
Como el segundo usuario, intenta reservar las fechas que fueron canceladas.  
  
Resultado esperado: La reserva debe completarse sin problemas.
Verifica que las fechas estén disponibles nuevamente en el endpoint de reservas.
  
Notas adicionales  
Utiliza variables de entorno en Postman para guardar valores como el token ({{token}}), el ID del alojamiento ({{airbnbId}}), y el ID de la reserva ({{reservaId}}).  
Crea una colección en Postman para guardar cada uno de estos pasos como una solicitud independiente. Esto facilitará el flujo de pruebas.

