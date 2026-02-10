
# Medical Appointment Management App

Aplicación para gestión de turnos médicos con estados controlados, panel de administración y seguimiento de pacientes.

## Descripción del proyecto

Permite registrar turnos, consultar su estado y administrar la atención en una clínica. El flujo de estados está validado para evitar saltos inválidos.

## Estados mínimos requeridos

- scheduled (turno asignado)
- checked_in (el paciente/cliente llegó y espera)
- in_service (está siendo atendido)
- completed (atención finalizada)
- no_show (no se presentó)
- cancelled (cancelado)

## Stack utilizado

Frontend
- React + Vite
- Formularios, manejo de estado y llamadas a API

Backend
- Node.js con NestJS
- API REST con validación de estados

Base de Datos
- MongoDB Atlas

## Instrucciones para correrlo localmente

Frontend
1. `cd frontend`
2. `npm i`
3. `npm run dev`

Backend
1. `cd backend`
2. `npm i`
3. `npm run dev`

## Variables de entorno necesarias

Frontend
- `VITE_API_URL` (URL base del backend, ver `frontend/.env.example`)

Backend
- `MONGODB_URI` (cadena de conexión a MongoDB Atlas)
- `PORT` (puerto del servidor)

### Endpoints (NestJS)

- `GET /appointments?date=YYYY-MM-DD`
- `GET /appointments/:id`
- `POST /appointments`
- `PATCH /appointments/:id/status`
- `DELETE /appointments/:id`

## Base de datos e importación

Para MongoDB Atlas se usa `database/seed.json` y el script de seed:
```
cd backend
npm run seed
```

## Credenciales de acceso

Si aplica, completar esta sección con usuario y contraseña del panel admin.

## Uso de IA

Se utilizó ChatGPT para aclarar dudas y validar el flujo de estados.

## Deploy

- Frontend: Vercel (u otro)
- Backend: Render / similar
- Base de datos: MongoDB Atlas (nube)
