const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');
const authenticateToken = require('../middlewares/authMiddleware.js');

// Rutas de facturas
router.get('/facturas/hoy', authenticateToken, facturaController.getToday);
router.get("/facturas/semana", authenticateToken, facturaController.getWeek);
router.get("/facturas/mes", authenticateToken, facturaController.getMonth);
router.get('/facturas/search', authenticateToken, facturaController.getFacturas);
router.get('/facturas', authenticateToken, facturaController.getAll);
router.get('/facturas/consecutivo', authenticateToken, facturaController.getConsecutivo);
router.get('/facturas/detalles/:id', authenticateToken, facturaController.getDetallesById);
router.get('/facturas/:id_factura', authenticateToken, facturaController.getById);
router.post('/facturas', authenticateToken, facturaController.insert);
router.post('/facturas/guardar', authenticateToken, facturaController.guardarFacturaCompleta);
router.put('/facturas/:id_factura', authenticateToken, facturaController.update);
router.delete('/facturas/:id_factura', authenticateToken, facturaController.delete);

module.exports = router;
