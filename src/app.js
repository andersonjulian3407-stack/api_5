const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(cors({
  origin: [
    'https://frontend-5-liard.vercel.app', // Vercel producción
    'http://localhost:3001',                // desarrollo local
    'http://127.0.0.1:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Orders API',
      version: '1.0.0',
      description: 'API REST para gestión de pedidos',
    },
    servers: [{ url: 'http://localhost:3000/api/v1' }],
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            product: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                productName: { type: 'string' },
                unitPrice: { type: 'number' },
                package: { type: 'string' },
                isDiscontinued: { type: 'boolean' },
              },
            },
            unitPrice: { type: 'number' },
            quantity: { type: 'integer' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            orderNumber: { type: 'string' },
            orderDate: { type: 'string', format: 'date-time' },
            totalAmount: { type: 'number' },
            customer: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                city: { type: 'string' },
                country: { type: 'string' },
                phone: { type: 'string' },
              },
            },
            items: { type: 'array', items: { $ref: '#/components/schemas/Item' } },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          summary: 'Health check',
          tags: ['Sistema'],
          responses: { 200: { description: 'API funcionando correctamente' } },
        },
      },
      '/orders': {
        get: {
          summary: 'Listar pedidos',
          tags: ['Pedidos'],
          parameters: [
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'customerId', in: 'query', schema: { type: 'integer' } },
            { name: 'dateFrom', in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'dateTo', in: 'query', schema: { type: 'string', format: 'date' } },
          ],
          responses: {
            200: {
              description: 'Lista paginada de pedidos',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      count: { type: 'integer' },
                      rows: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          summary: 'Crear pedido',
          tags: ['Pedidos'],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['customerId', 'items'],
                  properties: {
                    customerId: { type: 'integer', example: 1 },
                    items: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          product: { type: 'object', properties: { id: { type: 'integer' }, productName: { type: 'string' }, unitPrice: { type: 'number' } } },
                          unitPrice: { type: 'number', example: 24.90 },
                          quantity: { type: 'integer', example: 2 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Pedido creado' },
            400: { description: 'Datos inválidos' },
          },
        },
      },
      '/orders/{orderId}': {
        get: {
          summary: 'Obtener pedido por ID',
          tags: ['Pedidos'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: {
            200: { description: 'Pedido encontrado' },
            404: { description: 'Pedido no encontrado' },
          },
        },
        patch: {
          summary: 'Actualizar pedido (parcial)',
          tags: ['Pedidos'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
          },
          responses: { 200: { description: 'Pedido actualizado' }, 404: { description: 'No encontrado' } },
        },
        put: {
          summary: 'Reemplazar pedido completo',
          tags: ['Pedidos'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } },
          },
          responses: { 200: { description: 'Pedido reemplazado' }, 404: { description: 'No encontrado' } },
        },
        delete: {
          summary: 'Eliminar pedido',
          tags: ['Pedidos'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'Pedido eliminado' }, 404: { description: 'No encontrado' } },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Rutas ────────────────────────────────────────────────────────────────────
const orderRoutes = require('./routes/orderRoutes');

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/v1/orders', orderRoutes);

// Manejo global de errores
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
