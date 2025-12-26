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

    getToday: async (req, res) => {
        try {
            const facturas = await FacturaModel.getToday();
            res.status(200).json(facturas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener las facturas del día" });
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

    getFacturas: async (req, res) => {
        try {
            const { cedula, id_factura } = req.query;


            if (!cedula && !id_factura) {
                return res.status(400).json({
                    message: "Debe proporcionar una cédula o un id_factura."
                });
            }

            const facturas = await FacturaModel.getFacturas({
                cedula,
                id_factura
            });

            return res.status(200).json(facturas);

        } catch (error) {
            console.error("Error al obtener facturas:", error);
            return res.status(500).json({
                message: "Error interno del servidor."
            });
        }


    },

    getWeek: async (req, res) => {
        try {
            const facturas = await FacturaModel.getWeek();
            res.status(200).json(facturas);
        } catch (error) {
            console.error("Error al obtener facturas de la semana:", error);
            res.status(500).json({
                error: "Error al obtener las facturas de la semana"
            });
        }
    },


    getMonth: async (req, res) => {
        try {
            const facturas = await FacturaModel.getMonth();
            res.status(200).json(facturas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al obtener las facturas del mes" });
        }
    }
};

module.exports = facturaController;