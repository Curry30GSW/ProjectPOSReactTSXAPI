const FacturaModel = require('../models/facturaModel');

const facturaController = {
    getAll: async (req, res) => {
        try {
            const facturas = await FacturaModel.getAll();
            res.json(facturas);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const { id_factura } = req.params;
            const factura = await FacturaModel.getById(id_factura);
            if (!factura) return res.status(404).json({ message: "Factura no encontrada" });
            res.json(factura);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    insert: async (req, res) => {
        try {
            const data = req.body;
            const nuevaFactura = await FacturaModel.insert(data);
            res.status(201).json({ message: "Factura registrada correctamente", factura: nuevaFactura });
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { id_factura } = req.params;
            const data = req.body;
            const result = await FacturaModel.update(id_factura, data);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const { id_factura } = req.params;
            const result = await FacturaModel.delete(id_factura);
            res.json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getConsecutivo: async (req, res) => {
        try {
            const consecutivo = await FacturaModel.getConsecutivo();
            res.json(consecutivo);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    guardarFacturaCompleta: async (req, res) => {
        try {
            const result = await FacturaModel.guardarFacturaCompleta(req.body);
            res.status(201).json(result);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getDetallesById: async (req, res) => {
        try {
            const { id } = req.params;
            const data = await FacturaModel.getDetallesById(id);
            res.json(data);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
};

module.exports = facturaController;
