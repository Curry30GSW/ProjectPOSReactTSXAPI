const express = require('express');
const router = express.Router();
const EmpleadosController = require('../controllers/empleadosController');


router.get("/empleados", EmpleadosController.getEmpleados);
router.post("/empleados", EmpleadosController.crearEmpleado);
router.put("/empleados/:id_empleado", EmpleadosController.actualizarEmpleado);
router.put("/empleados/:id_empleado/inactivar", EmpleadosController.inactivarEmpleado);

module.exports = router;