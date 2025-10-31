const ArticuloModel = require('../models/articuloModel');

const articuloController = {
    // Obtener todos los artículos
    getAll: async (req, res) => {
        try {
            const articulos = await ArticuloModel.getAll();
            res.json(articulos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Obtener un artículo por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const articulo = await ArticuloModel.getById(id);
            if (!articulo) {
                return res.status(404).json({ message: "Artículo no encontrado" });
            }
            res.json(articulo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Insertar un nuevo artículo
    insert: async (req, res) => {
        try {
            const data = req.body;
            const nuevoArticulo = await ArticuloModel.insert(data);
            res.status(201).json({
                message: "Artículo registrado correctamente",
                articulo: nuevoArticulo,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Actualizar un artículo
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ArticuloModel.update(id, data);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Eliminar artículo
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await ArticuloModel.delete(id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Buscar artículo por código o descripción
    buscar: async (req, res) => {
        try {
            const { q } = req.query;
            const articulos = await ArticuloModel.buscar(q);
            res.json(articulos);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = articuloController;
