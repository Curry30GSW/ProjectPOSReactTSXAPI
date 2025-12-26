const pool = require("../config/db");

const CierreModel = {
    // Obtener todos los cierres de caja
    obtenerTodosCierres: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    cc.*,
                    c.fecha_caja,
                    c.efectivo_inicial as caja_efectivo_inicial
                FROM cierres_caja cc
                LEFT JOIN caja c ON cc.id_caja = c.id_caja
                ORDER BY cc.fecha_cierre DESC
            `);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Obtener un cierre por ID
    obtenerCierrePorId: async (id_cierre) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    cc.*,
                    c.fecha_caja,
                    c.efectivo_inicial as caja_efectivo_inicial
                FROM cierres_caja cc
                LEFT JOIN caja c ON cc.id_caja = c.id_caja
                WHERE cc.id_cierre = ?
            `, [id_cierre]);

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    },


    // Obtener todas las facturas del día con detalles
    obtenerFacturasDetalladasPorDia: async (fecha) => {
        try {
            const [rows] = await pool.query(`
            SELECT 
                f.id_factura,
                f.fecha_venta,
                f.total,
                f.id_cliente,
                COALESCE(c.cedula, 'Consumidor final') as cedula_cliente,
                COALESCE(c.nombre, 'Consumidor final') as nombre_cliente,
                f.id_metodo,
                COALESCE(mp.nombre, 'No especificado') as metodo_pago
            FROM factura f
            LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
            LEFT JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
            WHERE DATE(f.fecha_venta) = DATE(?)
            ORDER BY f.fecha_venta DESC
        `, [fecha]);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Obtener consolidado de ventas por día (para el cierre)
    obtenerConsolidadoVentasDia: async (fecha) => {
        try {
            const [rows] = await pool.query(`
            SELECT 
                SUM(CASE WHEN mp.nombre = 'Efectivo' 
                    THEN CAST(f.total AS DECIMAL(10,2)) ELSE 0 END) AS total_efectivo,

                SUM(CASE WHEN mp.nombre = 'Transferencia' 
                    THEN CAST(f.total AS DECIMAL(10,2)) ELSE 0 END) AS total_transferencias,

                SUM(CASE WHEN mp.nombre = 'Tarjeta' 
                    THEN CAST(f.total AS DECIMAL(10,2)) ELSE 0 END) AS total_tarjetas,

                SUM(CASE WHEN mp.nombre = 'Mixto' 
                    THEN CAST(f.total AS DECIMAL(10,2)) ELSE 0 END) AS total_mixto,

                COUNT(CASE WHEN mp.nombre = 'Efectivo' THEN 1 END) AS cantidad_efectivo,
                COUNT(CASE WHEN mp.nombre = 'Transferencia' THEN 1 END) AS cantidad_transferencias,
                COUNT(CASE WHEN mp.nombre = 'Tarjeta' THEN 1 END) AS cantidad_tarjetas,
                COUNT(CASE WHEN mp.nombre = 'Mixto' THEN 1 END) AS cantidad_mixto,

                SUM(CAST(f.total AS DECIMAL(10,2))) AS total_ventas,
                COUNT(f.id_factura) AS total_facturas
            FROM factura f
            LEFT JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
            WHERE DATE(f.fecha_venta) = DATE(?)
        `, [fecha]);

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    },



    // Obtener facturas relacionadas a un cierre
    obtenerFacturasPorCierre: async (fechaCierre) => {
        try {
            const [rows] = await pool.query(`
            SELECT 
                f.id_factura,
                f.fecha_venta,
                f.total,
                f.id_cliente,
                c.cedula,
                c.nombre as nombre_cliente,
                f.id_metodo,
                mp.nombre as metodo_pago,
                u.nombre as usuario_nombre
            FROM facturas f
            LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
            LEFT JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
            LEFT JOIN usuarios u ON f.usuario_venta = u.id_usuario
            WHERE DATE(f.fecha_venta) = DATE(?)
            ORDER BY f.fecha_venta DESC
        `, [fechaCierre]);

            return rows;
        } catch (error) {
            throw error;
        }
    },


    // Obtener facturas por id_caja (si tienes este campo en facturas)
    obtenerFacturasPorIdCaja: async (id_caja) => {
        try {
            const [rows] = await pool.query(`
            SELECT 
                f.id_factura,
                f.fecha_venta,
                f.total,
                f.id_cliente,
                c.cedula,
                c.nombre as nombre_cliente,
                f.id_metodo,
                mp.nombre as metodo_pago,
                u.nombre as usuario_nombre
            FROM facturas f
            LEFT JOIN clientes c ON f.id_cliente = c.id_cliente
            LEFT JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
            LEFT JOIN usuarios u ON f.usuario_venta = u.id_usuario
            WHERE f.id_caja = ?
            ORDER BY f.fecha_venta DESC
        `, [id_caja]);

            return rows;
        } catch (error) {
            throw error;
        }
    },


    // Filtrar cierres por fecha
    obtenerCierresPorFecha: async (fecha) => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    cc.*,
                    c.fecha_caja,
                    c.efectivo_inicial as caja_efectivo_inicial
                FROM cierres_caja cc
                LEFT JOIN caja c ON cc.id_caja = c.id_caja
                WHERE DATE(cc.fecha_cierre) = DATE(?)
                ORDER BY cc.fecha_cierre DESC
            `, [fecha]);

            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Obtener estadísticas generales
    obtenerEstadisticasCierres: async () => {
        try {
            const [rows] = await pool.query(`
                SELECT 
                    COUNT(*) as total_cierres,
                    SUM(total_ventas) as ventas_totales,
                    SUM(efectivo_esperado) as efectivo_total,
                    SUM(diferencia) as diferencia_total,
                    AVG(total_ventas) as promedio_ventas,
                    MIN(fecha_cierre) as primer_cierre,
                    MAX(fecha_cierre) as ultimo_cierre
                FROM cierres_caja
            `);

            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            throw error;
        }
    },

    // Crear un nuevo cierre
    crearCierre: async (data) => {
        try {
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
                data.observaciones || '',
                data.usuario_cierre
            ];

            const [result] = await pool.query(sql, params);
            return result.insertId;
        } catch (error) {
            throw error;
        }
    },

    // Actualizar observaciones de un cierre
    actualizarObservaciones: async (id_cierre, observaciones) => {
        try {
            const [result] = await pool.query(
                "UPDATE cierres_caja SET observaciones = ? WHERE id_cierre = ?",
                [observaciones, id_cierre]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    },

    // Eliminar un cierre (solo admin)
    eliminarCierre: async (id_cierre) => {
        try {
            const [result] = await pool.query(
                "DELETE FROM cierres_caja WHERE id_cierre = ?",
                [id_cierre]
            );

            return result.affectedRows > 0;
        } catch (error) {
            throw error;
        }
    },



};

module.exports = CierreModel;