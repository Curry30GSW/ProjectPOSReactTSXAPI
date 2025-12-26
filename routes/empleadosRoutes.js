const express = require('express');
const router = express.Router();
const EmpleadosController = require('../controllers/empleadosController');
const authenticateToken = require('../middlewares/authMiddleware.js');


router.get("/empleados", authenticateToken, EmpleadosController.getEmpleados);
router.post("/empleados", authenticateToken, EmpleadosController.crearEmpleado);
router.put("/empleados/:id_empleado", authenticateToken, EmpleadosController.actualizarEmpleado);
router.put("/empleados/:id_empleado/inactivar", authenticateToken, EmpleadosController.inactivarEmpleado);

module.exports = router;