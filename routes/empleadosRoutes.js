const express = require('express');
const router = express.Router();
const EmpleadosController = require('../controllers/empleadosController');
const authenticateToken = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/multerEdit.js')


router.get("/empleados", authenticateToken, EmpleadosController.getEmpleados);
router.get("/empleados/:cedula", authenticateToken, EmpleadosController.getEmpleadosByCedula)
router.post("/empleados", authenticateToken, EmpleadosController.crearEmpleado);
router.put("/empleados/:id_empleado", authenticateToken, EmpleadosController.actualizarEmpleado);
router.put("/empleados/:id_empleado/inactivar", authenticateToken, EmpleadosController.inactivarEmpleado);
router.put("/empleados/:cedula/foto", authenticateToken, upload, EmpleadosController.actualizarFoto)
router.delete("/empleados/:cedula/foto", authenticateToken, EmpleadosController.eliminarFoto);


module.exports = router;