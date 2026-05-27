const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const homogenizeRoutes = require('./routes/homogenize.routes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://db:27017/climatic_homogenization';

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', homogenizeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Climatic Homogenization API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Conexión a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
  })
  .catch((err) => {
    console.error('⚠️ No se pudo conectar a MongoDB:', err.message);
    console.log('⚠️ El servidor funcionará sin persistencia de datos');
  });

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
  console.log(`📋 Endpoints:`);
  console.log(`   POST /api/homogenize - Homogenizar datos`);
  console.log(`   GET  /api/history    - Ver historial`);
  console.log(`   GET  /api/health     - Health check`);
});

module.exports = app;