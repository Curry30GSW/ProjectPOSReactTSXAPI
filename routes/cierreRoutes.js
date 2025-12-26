const express = require('express');
const router = express.Router();
const cierreController = require('../controllers/cierreController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Obtener todos los cierres
router.get('/cierres', cierreController.obtenerTodos);

// Obtener estadísticas generales
router.get('/cierres/estadisticas', cierreController.obtenerEstadisticas);

// Obtener cierres por fecha
router.get('/cierres/filtrar', cierreController.obtenerPorFecha);

// Obtener detalles de un cierre específico
router.get('/cierres/detalles/:id', cierreController.obtenerDetalles);

// Crear nuevo cierre
router.post('/', cierreController.crearCierre);

// Actualizar observaciones
router.put('/cierres/:id/observaciones', cierreController.actualizarObservaciones);

module.exports = router;