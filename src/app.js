const express    = require('express');
const cors       = require('cors');
const swaggerUi  = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const app = express();

app.use(cors({
  origin: [
    'https://frontend-5-liard.vercel.app',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Swagger ───────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Orders API', version: '1.0.0', description: 'API REST para gestión de pedidos' },
    servers: [
      { url: 'https://api-5-1-8beo.onrender.com/api/v1', description: 'Producción' },
      { url: 'http://localhost:3000/api/v1', description: 'Local' },
    ],
    tags: [
      { name: 'Sistema' },
      { name: 'Orders' },
      { name: 'Items' },
      { name: 'Products' },
      { name: 'Customers' },
      { name: 'Suppliers' },
    ],
    components: {
      schemas: {
        Supplier: {
          type: 'object',
          properties: {
            id: { type: 'integer' }, companyName: { type: 'string' },
            contactName: { type: 'string' }, contactTitle: { type: 'string' },
            city: { type: 'string' }, country: { type: 'string' },
            phone: { type: 'string' }, fax: { type: 'string', nullable: true },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'integer' }, productName: { type: 'string' },
            unitPrice: { type: 'number' }, package: { type: 'string' },
            isDiscontinued: { type: 'boolean' }, supplierId: { type: 'integer' },
            supplier: { $ref: '#/components/schemas/Supplier' },
          },
        },
        Customer: {
          type: 'object',
          properties: {
            id: { type: 'integer' }, firstName: { type: 'string' },
            lastName: { type: 'string' }, city: { type: 'string' },
            country: { type: 'string' }, phone: { type: 'string' },
          },
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            product: { $ref: '#/components/schemas/Product' },
            unitPrice: { type: 'number' }, quantity: { type: 'integer' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' }, orderNumber: { type: 'string' },
            orderDate: { type: 'string', format: 'date-time' },
            totalAmount: { type: 'number' },
            customer: { $ref: '#/components/schemas/Customer' },
            items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
          },
        },
        PaginatedOrders: {
          type: 'object',
          properties: {
            count: { type: 'integer' },
            rows: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
          },
        },
      },
    },
    paths: {
      '/health': {
        get: { summary: 'Health check', tags: ['Sistema'],
          responses: { 200: { description: '{ status: "ok", timestamp: "..." }' } } },
      },
      '/orders': {
        get: { summary: 'Listar pedidos', tags: ['Orders'],
          parameters: [
            { name: 'page',       in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit',      in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'customerId', in: 'query', schema: { type: 'integer' } },
            { name: 'dateFrom',   in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'dateTo',     in: 'query', schema: { type: 'string', format: 'date' } },
            { name: 'sort',       in: 'query', schema: { type: 'string', example: 'totalAmount_desc' } },
          ],
          responses: { 200: { description: 'Lista paginada', content: { 'application/json': { schema: { $ref: '#/components/schemas/PaginatedOrders' } } } } },
        },
        post: { summary: 'Crear pedido', tags: ['Orders'],
          requestBody: { required: true, content: { 'application/json': { schema: {
            type: 'object', required: ['customerId', 'items'],
            properties: {
              customerId: { type: 'integer', example: 1 },
              items: { type: 'array', items: { type: 'object', properties: {
                productId: { type: 'integer', example: 1 },
                quantity:  { type: 'integer', example: 2 },
                unitPrice: { type: 'number',  example: 24.90 },
              }}},
            },
          }}}},
          responses: { 201: { description: 'Pedido creado' }, 400: { description: 'Datos inválidos' } },
        },
      },
      '/orders/{orderId}': {
        get:    { summary: 'Obtener pedido', tags: ['Orders'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        put:    { summary: 'Reemplazar pedido', tags: ['Orders'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } },
          responses: { 200: { description: 'OK' }, 400: { description: 'Bad Request' }, 404: { description: 'Not Found' } } },
        patch:  { summary: 'Actualizar pedido parcialmente', tags: ['Orders'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: {
            orderDate: { type: 'string', format: 'date-time' },
            customerId: { type: 'integer' },
            status: { type: 'string' },
          }}}},
          },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Eliminar pedido', tags: ['Orders'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'No Content' }, 404: { description: 'Not Found' } } },
      },
      '/orders/{orderId}/items': {
        get:  { summary: 'Listar items del pedido', tags: ['Items'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'Lista de items' }, 404: { description: 'Not Found' } } },
        post: { summary: 'Agregar item al pedido', tags: ['Items'],
          parameters: [{ name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            required: ['productId', 'quantity'],
            properties: {
              productId: { type: 'integer', example: 2 },
              quantity:  { type: 'integer', example: 3 },
              unitPrice: { type: 'number',  example: 40.00 },
            },
          }}}},
          responses: { 201: { description: 'Item agregado, totalAmount recalculado' }, 400: { description: 'Bad Request' }, 404: { description: 'Not Found' } } },
      },
      '/orders/{orderId}/items/{itemId}': {
        patch:  { summary: 'Actualizar item', tags: ['Items'],
          parameters: [
            { name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'itemId',  in: 'path', required: true, schema: { type: 'integer' } },
          ],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: {
            quantity:  { type: 'integer' },
            unitPrice: { type: 'number' },
          }}}}},
          responses: { 200: { description: 'OK, totalAmount recalculado' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Eliminar item', tags: ['Items'],
          parameters: [
            { name: 'orderId', in: 'path', required: true, schema: { type: 'integer' } },
            { name: 'itemId',  in: 'path', required: true, schema: { type: 'integer' } },
          ],
          responses: { 204: { description: 'No Content, totalAmount recalculado' }, 404: { description: 'Not Found' } } },
      },
      '/products': {
        get:  { summary: 'Listar productos', tags: ['Products'],
          parameters: [
            { name: 'page',         in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit',        in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'supplierId',   in: 'query', schema: { type: 'integer' } },
            { name: 'search',       in: 'query', schema: { type: 'string' } },
            { name: 'discontinued', in: 'query', schema: { type: 'boolean' } },
          ],
          responses: { 200: { description: 'OK' } } },
        post: { summary: 'Crear producto', tags: ['Products'],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            required: ['productName', 'unitPrice'],
            properties: {
              productName:    { type: 'string' }, supplierId: { type: 'integer' },
              unitPrice:      { type: 'number' }, package:    { type: 'string' },
              isDiscontinued: { type: 'boolean' },
            },
          }}}},
          responses: { 201: { description: 'Creado' }, 400: { description: 'Bad Request' } } },
      },
      '/products/{productId}': {
        get:    { summary: 'Obtener producto', tags: ['Products'],
          parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        put:    { summary: 'Reemplazar producto', tags: ['Products'],
          parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch:  { summary: 'Actualizar producto', tags: ['Products'],
          parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { type: 'object', properties: {
            unitPrice: { type: 'number' }, isDiscontinued: { type: 'boolean' },
          }}}}},
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        delete: { summary: 'Eliminar o discontinuar producto', tags: ['Products'],
          parameters: [{ name: 'productId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 204: { description: 'Eliminado' }, 200: { description: 'Marcado como discontinuado' }, 404: { description: 'Not Found' } } },
      },
      '/customers': {
        get:  { summary: 'Listar clientes', tags: ['Customers'],
          parameters: [
            { name: 'page',    in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit',   in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'country', in: 'query', schema: { type: 'string' } },
            { name: 'city',    in: 'query', schema: { type: 'string' } },
            { name: 'search',  in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } } },
        post: { summary: 'Crear cliente', tags: ['Customers'],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            required: ['firstName', 'lastName'],
            properties: {
              firstName: { type: 'string' }, lastName: { type: 'string' },
              city: { type: 'string' }, country: { type: 'string' }, phone: { type: 'string' },
            },
          }}}},
          responses: { 201: { description: 'Creado' } } },
      },
      '/customers/{customerId}': {
        get:   { summary: 'Obtener cliente', tags: ['Customers'],
          parameters: [{ name: 'customerId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch: { summary: 'Actualizar cliente', tags: ['Customers'],
          parameters: [{ name: 'customerId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Customer' } } } },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
      '/customers/{customerId}/orders': {
        get: { summary: 'Pedidos de un cliente', tags: ['Customers'],
          parameters: [{ name: 'customerId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
      '/suppliers': {
        get:  { summary: 'Listar proveedores', tags: ['Suppliers'],
          parameters: [
            { name: 'page',    in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit',   in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'country', in: 'query', schema: { type: 'string' } },
            { name: 'search',  in: 'query', schema: { type: 'string' } },
          ],
          responses: { 200: { description: 'OK' } } },
        post: { summary: 'Crear proveedor', tags: ['Suppliers'],
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object',
            required: ['companyName'],
            properties: {
              companyName: { type: 'string' }, contactName: { type: 'string' },
              contactTitle: { type: 'string' }, city: { type: 'string' },
              country: { type: 'string' }, phone: { type: 'string' }, fax: { type: 'string' },
            },
          }}}},
          responses: { 201: { description: 'Creado' } } },
      },
      '/suppliers/{supplierId}': {
        get:   { summary: 'Obtener proveedor', tags: ['Suppliers'],
          parameters: [{ name: 'supplierId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
        patch: { summary: 'Actualizar proveedor', tags: ['Suppliers'],
          parameters: [{ name: 'supplierId', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Supplier' } } } },
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
      '/suppliers/{supplierId}/products': {
        get: { summary: 'Productos de un proveedor', tags: ['Suppliers'],
          parameters: [{ name: 'supplierId', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: { 200: { description: 'OK' }, 404: { description: 'Not Found' } } },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/v1/orders',    require('./routes/orderRoutes'));
app.use('/api/v1/products',  require('./routes/productRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/suppliers', require('./routes/supplierRoutes'));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use(require('./middlewares/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));

module.exports = app;
