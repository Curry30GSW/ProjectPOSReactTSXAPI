const ProveedorModel = require('../models/proveedorModel');

const proveedorController = {
    getAll: async (req, res) => {
        try {
            const proveedores = await ProveedorModel.getAll();
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const proveedor = await ProveedorModel.getById(id);
            if (!proveedor)
                return res.status(404).json({ message: "Proveedor no encontrado" });
            res.json(proveedor);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    insert: async (req, res) => {
        try {
            const data = req.body;
            const nuevoProveedor = await ProveedorModel.insert(data);
            res.status(201).json({
                message: "Proveedor registrado exitosamente.",
                proveedor: nuevoProveedor,
            });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            const result = await ProveedorModel.update(id, data);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await ProveedorModel.delete(id);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    buscar: async (req, res) => {
        try {
            const { q } = req.query;
            const proveedores = await ProveedorModel.buscar(q);
            res.json(proveedores);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = proveedorController;
