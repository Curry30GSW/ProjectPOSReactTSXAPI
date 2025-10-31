const pool = require('../config/db');

const FacturaModel = {
    // Obtener todas las facturas
    getAll: async () => {
        const [rows] = await pool.query("SELECT * FROM factura");
        return rows;
    },

    // Obtener una factura por ID
    getById: async (id_factura) => {
        const [rows] = await pool.query(
            "SELECT * FROM factura WHERE id_factura = ?",
            [id_factura]
        );
        return rows[0];
    },

    // Crear una factura simple
    insert: async (data) => {
        const [result] = await pool.query(
            "INSERT INTO factura (fecha_factura, total_factura, productos_factura) VALUES (?, ?, ?)",
            [data.fecha_factura, data.total_factura, data.productos_factura]
        );
        return { id_factura: result.insertId, ...data };
    },

    // Actualizar factura
    update: async (id_factura, data) => {
        await pool.query(
            "UPDATE factura SET fecha_factura = ?, total_factura = ?, productos_factura = ? WHERE id_factura = ?",
            [data.fecha_factura, data.total_factura, data.productos_factura, id_factura]
        );
        return { message: "Factura actualizada correctamente" };
    },

    // Eliminar factura
    delete: async (id_factura) => {
        await pool.query("DELETE FROM factura WHERE id_factura = ?", [id_factura]);
        return { message: "Factura eliminada correctamente" };
    },

    // Obtener consecutivo (último ID + 1)
    getConsecutivo: async () => {
        const [rows] = await pool.query("SELECT MAX(id_factura) AS ultimoNumero FROM factura");
        const ultimoNumero = rows[0]?.ultimoNumero || 0;
        return { numeroFactura: ultimoNumero + 1 };
    },

    // Crear factura con detalles
    guardarFacturaCompleta: async (data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { cedula, total, productos } = data;
            const productosValidos = productos.filter(p => p.id_articulo != null);

            if (productosValidos.length === 0) {
                throw new Error("No hay productos válidos para guardar.");
            }

            // Insertar factura
            const [facturaResult] = await connection.query(
                "INSERT INTO factura (cedula, fecha_venta, total) VALUES (?, NOW(), ?)",
                [cedula, total]
            );

            const id_factura = facturaResult.insertId;

            // Insertar detalles
            const detalles = productosValidos.map((p) => [
                id_factura,
                p.id_articulo,
                p.cantidad,
                p.descuento,
                p.metodo_pago,
            ]);

            await connection.query(
                "INSERT INTO detalle_factura (id_factura, id_articulo, cantidad, descuento, metodo_pago) VALUES ?",
                [detalles]
            );

            await connection.commit();
            return { message: "Factura creada correctamente", id_factura };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Obtener los detalles completos de una factura
    getDetallesById: async (id_factura) => {
        // 1️⃣ Obtenemos la factura y datos del cliente asociado
        const [factura] = await pool.query(`
    SELECT 
      f.id_factura,
      f.fecha_venta,
      f.total,
      c.id_cliente,
      c.cedula,
      c.nombre,
      c.correo,
      c.telefono
    FROM factura f
    JOIN clientes c ON f.id_cliente = c.id_cliente
    WHERE f.id_factura = ?
  `, [id_factura]);

        if (factura.length === 0) throw new Error("Factura no encontrada.");

        // 2️⃣ Obtenemos los detalles de los artículos y el método de pago
        const [detalles] = await pool.query(`
    SELECT 
      df.id_detalle,
      df.cantidad,
      df.precio_unitario,
      a.descripcion AS articulo,
      a.codigo_barras,
      mp.nombre AS metodo_pago
    FROM detalle_factura df
    JOIN articulos a ON df.id_articulo = a.id_articulo
    JOIN metodo_pago mp ON df.id_metodo = mp.id_metodo
    WHERE df.id_factura = ?
  `, [id_factura]);

        // 3️⃣ Retornamos todo junto
        return { factura: factura[0], detalles };
    },

};

module.exports = FacturaModel;
