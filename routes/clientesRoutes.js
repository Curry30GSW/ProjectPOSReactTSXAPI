const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clientesController');
const authenticateToken = require('../middlewares/authMiddleware.js');

// Buscar por texto o cédula
router.get('/buscar', authenticateToken, clienteController.buscar);

// Obtener todos los clientes
router.get('/clientes', authenticateToken, clienteController.getAll);

// Obtener cliente por ID
router.get('/clientes/:id', authenticateToken, clienteController.getById);

// Buscar por cédula (nombre)
router.get('/clientes/cedula/:cedula', authenticateToken, clienteController.getByCedula);

// Insertar nuevo cliente
router.post('/clientes', authenticateToken, clienteController.insert);

// Actualizar cliente
router.put('/clientes/:id', authenticateToken, clienteController.update);

// Eliminar cliente
router.delete('/clientes/:id', authenticateToken, clienteController.delete);

module.exports = router;
