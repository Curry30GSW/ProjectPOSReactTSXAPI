const express = require('express');
const router = express.Router();
const facturaController = require('../controllers/facturaController');

// Rutas de facturas
router.get('/facturas', facturaController.getAll);
router.get('/facturas/consecutivo', facturaController.getConsecutivo);
router.get('/facturas/detalles/:id', facturaController.getDetallesById);
router.get('/facturas/:id_factura', facturaController.getById);
router.post('/facturas', facturaController.insert);
router.post('/facturas/guardar', facturaController.guardarFacturaCompleta);
router.put('/facturas/:id_factura', facturaController.update);
router.delete('/facturas/:id_factura', facturaController.delete);

module.exports = router;
