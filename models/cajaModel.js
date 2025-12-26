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
    },

    guardar: async (data) => {
        const sql = `
            INSERT INTO cierres_caja (
                id_caja,
                efectivo_inicial,
                total_ventas,
                total_efectivo,
                total_transferencias,
                total_tarjetas,
                total_mixto,
                efectivo_esperado,
                efectivo_contado,
                diferencia,
                observaciones,
                usuario_cierre
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const params = [
            data.id_caja,
            data.efectivo_inicial,
            data.total_ventas,
            data.total_efectivo,
            data.total_transferencias,
            data.total_tarjetas,
            data.total_mixto,
            data.efectivo_esperado,
            data.efectivo_contado,
            data.diferencia,
            data.observaciones,
            data.usuario_cierre
        ];

        const [result] = await pool.query(sql, params);
        return result.insertId;
    },

    verificarCierreExisteHoy: async () => {
        const hoy = new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            "SELECT * FROM cierres_caja WHERE DATE(fecha_cierre) = ?",
            [hoy]
        );

        return {
            existe: rows.length > 0,
            cantidad: rows.length,
            cierres: rows
        };
    }



};


module.exports = CajaModel;



