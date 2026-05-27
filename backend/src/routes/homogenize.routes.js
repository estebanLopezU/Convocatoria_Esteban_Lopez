const express = require('express');
const router = express.Router();
const { homogenize } = require('../services/homogenizer');
const History = require('../models/history');

/**
 * POST /homogenize
 * Recibe un JSON con datos crudos y devuelve el array procesado
 * bajo las reglas de interpolación lineal.
 *
 * Body esperado:
 * {
 *   stationName: "Nombre de la estación (opcional)",
 *   data: [
 *     { fecha: "11/5/2015", hora: "19:36:21", temp: 16.17, ... }
 *   ]
 * }
 */
router.post('/homogenize', async (req, res) => {
  try {
    const { data, stationName } = req.body;

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        error: 'El campo "data" es requerido y debe ser un array no vacío.'
      });
    }

    const startTime = Date.now();
    const outputData = homogenize(data);
    const processingTime = Date.now() - startTime;

    // Guardar en historial
    try {
      const historyEntry = new History({
        inputData: data,
        outputData,
        summary: {
          totalInputRecords: data.length,
          totalOutputRecords: outputData.length,
          stationName: stationName || 'Sin nombre'
        }
      });
      await historyEntry.save();
    } catch (dbError) {
      console.error('Error al guardar en historial (no crítico):', dbError.message);
    }

    res.json({
      success: true,
      processingTimeMs: processingTime,
      summary: {
        inputRecords: data.length,
        outputRecords: outputData.length,
        stationName: stationName || 'Sin nombre'
      },
      inputData: data,
      outputData
    });

  } catch (error) {
    console.error('Error en /homogenize:', error);
    res.status(500).json({
      error: 'Error interno del servidor al procesar los datos.',
      details: error.message
    });
  }
});

/**
 * GET /history
 * Recupera los últimos cálculos realizados desde la base de datos.
 *
 * Query params:
 * - limit: número de registros a devolver (default: 10)
 * - page: página de resultados (default: 1)
 */
router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      History.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-inputData -outputData') // Excluir datos completos para listado
        .lean(),
      History.countDocuments()
    ]);

    res.json({
      success: true,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      records
    });

  } catch (error) {
    console.error('Error en /history:', error);
    res.status(500).json({
      error: 'Error al recuperar el historial.',
      details: error.message
    });
  }
});

/**
 * GET /history/:id
 * Recupera un cálculo específico con todos sus detalles.
 */
router.get('/history/:id', async (req, res) => {
  try {
    const record = await History.findById(req.params.id).lean();

    if (!record) {
      return res.status(404).json({ error: 'Registro no encontrado.' });
    }

    res.json({
      success: true,
      record
    });

  } catch (error) {
    console.error('Error en /history/:id:', error);
    res.status(500).json({
      error: 'Error al recuperar el registro.',
      details: error.message
    });
  }
});

module.exports = router;