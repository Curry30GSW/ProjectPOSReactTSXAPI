const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articulosController');

// Obtener todos los artículos
router.get('/articulos', articuloController.getAll);

// Obtener un artículo por ID
router.get('/articulos/:id', articuloController.getById);

// Insertar un nuevo artículo
router.post('/insertar-articulos', articuloController.insert);

// Actualizar un artículo
router.put('/actualizar-articulos/:id', articuloController.update);

// Eliminar un artículo
router.delete('/eliminar-articulos/:id', articuloController.delete);

// Buscar artículo por código o descripción
router.get('/articulos/buscar', articuloController.buscar);

module.exports = router;
