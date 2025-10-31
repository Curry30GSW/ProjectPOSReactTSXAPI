const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientesController');

// Buscar por texto o cédula
router.get('/buscar', clienteController.buscar);

// Obtener todos los clientes
router.get('/clientes', clienteController.getAll);

// Obtener cliente por ID
router.get('/clientes/:id', clienteController.getById);

// Buscar por cédula (nombre)
router.get('/clientes/cedula/:cedula', clienteController.getByCedula);

// Insertar nuevo cliente
router.post('/clientes', clienteController.insert);

// Actualizar cliente
router.put('/clientes/:id', clienteController.update);

// Eliminar cliente
router.delete('/clientes/:id', clienteController.delete);

module.exports = router;
