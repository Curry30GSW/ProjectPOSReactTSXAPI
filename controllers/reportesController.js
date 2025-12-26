const ReportesModel = require("../models/reportesModel");

const agruparTop5 = (rows) => {
    const resultado = {};

    rows.forEach(row => {
        const key = `${row.anio}-${row.mes}`;

        if (!resultado[key]) resultado[key] = [];

        if (resultado[key].length < 5) {
            resultado[key].push(row);
        }
    });

    return resultado;
};

const reportesController = {

    topProductosPorMes: async (req, res) => {
        try {
            const data = await ReportesModel.topProductosPorMes();
            const resultado = agruparTop5(data);

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error al obtener productos"
            });
        }
    },

    topClientesPorMes: async (req, res) => {
        try {
            const data = await ReportesModel.topClientesPorMes();
            const resultado = agruparTop5(data);

            res.json({
                success: true,
                data: resultado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error al obtener clientes"
            });
        }
    },

    contarClientes: async (req, res) => {
        try {
            const total = await ReportesModel.contarClientes();

            res.json({
                success: true,
                total_clientes: total
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Error al contar los clientes"
            });
        }
    }

};

module.exports = reportesController;
