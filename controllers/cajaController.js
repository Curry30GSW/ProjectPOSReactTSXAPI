const CajaModel = require("../models/cajaModel");

const CajaController = {
    crearCaja: async (req, res) => {
        try {
            const { efectivo_inicial } = req.body;

            if (!efectivo_inicial || isNaN(efectivo_inicial)) {
                return res.status(400).json({ error: "efectivo_inicial es requerido y debe ser numérico" });
            }

            const cajaHoy = await CajaModel.verificarCajaHoy();
            if (cajaHoy) {
                return res.status(400).json({
                    error: "Ya hay una caja abierta hoy",
                    caja_existente: cajaHoy
                });
            }

            const id = await CajaModel.crearCaja(efectivo_inicial);

            res.status(201).json({
                message: "Caja creada correctamente",
                id_caja: id
            });

        } catch (error) {
            console.error("Error en crearCaja:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },


    verificarCajaHoy: async (req, res) => {
        try {
            const cajaHoy = await CajaModel.verificarCajaHoy();

            res.status(200).json({
                existe: !!cajaHoy,
                datos: cajaHoy || null
            });
        } catch (error) {
            console.error("Error en verificarCajaHoy:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },


    obtenerEfectivoInicialHoy: async (req, res) => {
        try {
            const efectivoInicial = await CajaModel.obtenerEfectivoInicialHoy();

            res.status(200).json({
                efectivo_inicial: efectivoInicial
            });
        } catch (error) {
            console.error("Error en obtenerEfectivoInicialHoy:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    actualizarEfectivoInicial: async (req, res) => {
        try {
            const { efectivo_inicial } = req.body;

            if (!efectivo_inicial || isNaN(efectivo_inicial)) {
                return res.status(400).json({ error: "efectivo_inicial es requerido y debe ser numérico" });
            }

            const actualizado = await CajaModel.actualizarEfectivoInicial(efectivo_inicial);

            if (!actualizado) {
                return res.status(404).json({ error: "No se encontró caja para hoy" });
            }

            res.status(200).json({
                message: "Efectivo inicial actualizado correctamente"
            });
        } catch (error) {
            console.error("Error en actualizarEfectivoInicial:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = CajaController;