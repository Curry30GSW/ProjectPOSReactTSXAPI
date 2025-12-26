const pool = require("../config/db");

const ReportesModel = {

    topProductosPorMes: async () => {
        const sql = `
            SELECT 
                YEAR(f.fecha_venta) AS anio,
                MONTH(f.fecha_venta) AS mes,
                a.id_articulo,
                a.descripcion,
                SUM(d.cantidad) AS total_vendido
            FROM detalle_factura d
            JOIN factura f ON f.id_factura = d.id_factura
            JOIN articulos a ON a.id_articulo = d.id_articulo
            GROUP BY anio, mes, a.id_articulo
            ORDER BY anio DESC, mes DESC, total_vendido DESC
        `;

        const [rows] = await pool.query(sql);
        return rows;
    },

    topClientesPorMes: async () => {
        const sql = `
        SELECT 
            YEAR(f.fecha_venta) AS anio,
            MONTH(f.fecha_venta) AS mes,
            c.id_cliente,
            c.nombre,
            COUNT(DISTINCT f.id_factura) AS total_facturas,
            SUM(d.cantidad * d.precio_unitario) AS total_comprado
        FROM factura f
        JOIN clientes c ON c.id_cliente = f.id_cliente
        JOIN detalle_factura d ON d.id_factura = f.id_factura
        GROUP BY anio, mes, c.id_cliente
        ORDER BY anio DESC, mes DESC, total_comprado DESC
    `;

        const [rows] = await pool.query(sql);
        return rows;
    },

    contarClientes: async () => {
        const [rows] = await pool.query(
            "SELECT COUNT(*) AS total_clientes FROM clientes"
        );

        return rows[0].total_clientes;
    }


};

module.exports = ReportesModel;
