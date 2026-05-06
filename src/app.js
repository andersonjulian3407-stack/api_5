const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
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
