const express = require('express');
const router = express.Router();
const Reportescontroller = require('../controllers/reportesController');

router.get('/top-productos-mes', Reportescontroller.topProductosPorMes);
router.get('/top-clientes-mes', Reportescontroller.topClientesPorMes);
router.get("/total-clientes", Reportescontroller.contarClientes);

module.exports = router;
