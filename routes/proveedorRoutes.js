const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');

// Buscar proveedor por cédula o nombre
router.get('/buscar', proveedorController.buscar);

// Obtener todos los proveedores
router.get('/proveedores', proveedorController.getAll);

// Obtener proveedor por ID
router.get('/proveedores/:id', proveedorController.getById);

// Insertar nuevo proveedor
router.post('/proveedores', proveedorController.insert);

// Actualizar proveedor
router.put('/proveedores/:id', proveedorController.update);

// Eliminar proveedor
router.delete('/proveedores/:id', proveedorController.delete);

module.exports = router;
