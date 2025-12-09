const pool = require("../config/db");

const CajaModel = {
    crearCaja: async (efectivo_inicial) => {
        const [result] = await pool.query(
            "INSERT INTO caja (efectivo_inicial) VALUES (?)",
            [efectivo_inicial]
        );
        return result.insertId;
    },


    verificarCajaHoy: async () => {

        const hoy = new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            "SELECT * FROM caja WHERE DATE(fecha_caja) = ?",
            [hoy]
        );

        return rows.length > 0 ? rows[0] : null;
    },


    obtenerEfectivoInicialHoy: async () => {
        const hoy = new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            "SELECT efectivo_inicial FROM caja WHERE DATE(fecha_caja) = ?",
            [hoy]
        );

        return rows.length > 0 ? rows[0].efectivo_inicial : null;
    },

    actualizarEfectivoInicial: async (efectivo_inicial) => {
        const hoy = new Date().toISOString().split('T')[0];

        const [result] = await pool.query(
            "UPDATE caja SET efectivo_inicial = ? WHERE DATE(fecha_caja) = ?",
            [efectivo_inicial, hoy]
        );

        return result.affectedRows > 0;
    }
};

module.exports = CajaModel;
