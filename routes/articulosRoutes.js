const express = require('express');
const router = express.Router();
const articuloController = require('../controllers/articulosController');
const authenticateToken = require('../middlewares/authMiddleware.js');

// Obtener todos los artículos
router.get('/articulos', authenticateToken, articuloController.getAll);

// Buscar artículo por código o descripción
router.get('/articulos/buscar', authenticateToken, articuloController.buscar);

// Obtener un artículo por ID
router.get('/articulos/:id', authenticateToken, articuloController.getById);

// Insertar un nuevo artículo
router.post('/insertar-articulos', authenticateToken, articuloController.insert);

// Actualizar un artículo
router.put('/actualizar-articulos/:id', authenticateToken, articuloController.update);

// Eliminar un artículo
router.delete('/eliminar-articulos/:id', authenticateToken, articuloController.delete);



module.exports = router;
