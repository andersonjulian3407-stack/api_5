# Orders API

REST API para gestión de pedidos construida con Express.js.

## Stack
- **Node.js + Express 5**
- **JSON** como base de datos
- **Swagger UI** para documentación
- **CORS** configurado para Vercel

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Corre en `http://localhost:3000`

## Producción

```bash
npm start
```

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/v1/health | Health check |
| GET | /api/v1/docs | Swagger UI |
| GET | /api/v1/orders | Listar pedidos (paginado) |
| GET | /api/v1/orders/:id | Obtener pedido |
| POST | /api/v1/orders | Crear pedido |
| PATCH | /api/v1/orders/:id | Actualizar pedido |
| PUT | /api/v1/orders/:id | Reemplazar pedido |
| DELETE | /api/v1/orders/:id | Eliminar pedido |

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| PORT | 3000 | Puerto del servidor |
