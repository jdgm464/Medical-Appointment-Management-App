
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

## Stack (sin cambiar diseño)

- **Backend:** Node.js con NestJS (TypeScript). Ya está correcto.
- **Frontend:** React + Vite. El diseño actual (Tailwind, componentes, estilos) se mantiene; solo se asegura que el despliegue funcione.

## Despliegue

### Frontend en Vercel

1. Conecta el repo en [Vercel](https://vercel.com).
2. En el proyecto → **Settings** → **General** → **Root Directory**: pon `frontend` y guarda.
3. En **Environment Variables** añade `VITE_API_URL` con la URL de tu backend desplegado (ej. `https://tu-backend.onrender.com`).
4. Haz deploy. El `frontend/vercel.json` ya tiene build, output y rewrites para el SPA.

**Si Vercel muestra error (404, build fallido, etc.):**

- Revisa que **Root Directory** sea exactamente `frontend`.
- Revisa los logs del build; si falla `npm run build`, prueba localmente: `cd frontend && npm run build`.
- Si aun así falla, puedes desplegar el frontend en otras plataformas (ver abajo).

### Backend (servidor Node.js): alternativas a Vercel

El backend es un servidor Node.js que escucha en un puerto. **Vercel está pensado para frontend estático o funciones serverless**, no para un servidor persistente como NestJS. Por eso el backend se despliega en otra plataforma:

| Plataforma | Uso recomendado | Notas |
|------------|------------------|--------|
| **[Render](https://render.com)** | Backend Node.js | Gratis (tier free), detecta NestJS. Root: `backend`, Build: `npm install && npm run build`, Start: `npm run start`. Añade `MONGODB_URI` y `PORT` (opcional). |
| **[Railway](https://railway.app)** | Backend Node.js | Root: `backend`, mismo build/start. Variables: `MONGODB_URI`, `PORT`. |
| **[Fly.io](https://fly.io)** | Backend Node.js | Requiere `fly.toml` y Dockerfile o buildpack. Muy estable. |
| **[Cyclic](https://www.cyclic.sh)** | Backend Node.js | Gratis, fácil para Node. |
| **[Vercel (Serverless)** | Solo si adaptas NestJS | Posible con `@vercel/node` y adaptador serverless; más trabajo y no recomendado para este proyecto. |

**Pasos típicos (Render o Railway):**

1. Crear proyecto nuevo → “Deploy from GitHub” y selecciona este repo.
2. **Root Directory** (o equivalente): `backend`.
3. **Build Command:** `npm install && npm run build`
4. **Start Command:** `npm run start`
5. Variables de entorno: `MONGODB_URI` (obligatoria), `PORT` (suelen asignarla ellos).
6. Después del deploy, copia la URL del backend (ej. `https://tu-app.onrender.com`) y úsala en el frontend como `VITE_API_URL` en Vercel.

### Resumen

- **Frontend (React):** Vercel con Root Directory `frontend`. Si Vercel da error, usa Netlify, Cloudflare Pages o el mismo flujo en Render (sitio estático desde `frontend/dist`).
- **Backend (Node.js):** Render, Railway, Fly.io o Cyclic; no Vercel para este servidor.
- **Base de datos:** MongoDB Atlas (ya en la nube).
