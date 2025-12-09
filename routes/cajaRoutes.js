const express = require("express");
const router = express.Router();
const CajaController = require("../controllers/cajaController");

router.post("/caja", CajaController.crearCaja);
router.get("/caja/hoy", CajaController.verificarCajaHoy);
router.get("/caja/efectivo-inicial", CajaController.obtenerEfectivoInicialHoy);
router.put("/caja/efectivo-inicial", CajaController.actualizarEfectivoInicial);

module.exports = router;