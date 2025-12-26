const express = require("express");
const router = express.Router();
const CajaController = require("../controllers/cajaController");
const authenticateToken = require('../middlewares/authMiddleware.js');

router.post("/caja", authenticateToken, CajaController.crearCaja);
router.post('/cierre/guardar', authenticateToken, CajaController.guardar);
router.get("/caja/hoy", authenticateToken, CajaController.verificarCajaHoy);
router.get("/caja/efectivo-inicial", authenticateToken, CajaController.obtenerEfectivoInicialHoy);
router.get("/verificar-hoy", CajaController.verificarCierreHoy);
router.put("/caja/efectivo-inicial", authenticateToken, CajaController.actualizarEfectivoInicial);
module.exports = router;