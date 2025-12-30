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

    //Obtener facturas del día actual
    getToday: async () => {
        const [rows] = await pool.query(`
     SELECT 
            f.id_factura,
            f.fecha_venta,
            f.total,
            f.total_iva,
            mp.nombre AS metodo_pago,
            c.cedula,
            c.nombre
        FROM factura f
        INNER JOIN metodo_pago mp 
            ON f.id_metodo = mp.id_metodo
        INNER JOIN clientes c
            ON f.id_cliente = c.id_cliente
        WHERE f.fecha_venta >= CURDATE()
        AND f.fecha_venta < CURDATE() + INTERVAL 1 DAY
        ORDER BY f.id_factura DESC;

    `);
        return rows;
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

            const { cedula, total, totalIva, productos, id_metodo } = data;
            const productosValidos = productos.filter(p => p.id_articulo != null);

            if (productosValidos.length === 0) {
                throw new Error("No hay productos válidos para guardar.");
            }

            // 1️⃣ Buscar ID del cliente
            const [clienteRows] = await connection.query(
                "SELECT id_cliente FROM clientes WHERE cedula = ?",
                [cedula]
            );

            if (clienteRows.length === 0) {
                throw new Error("Cliente no existe en la base de datos.");
            }

            const id_cliente = clienteRows[0].id_cliente;

            // 2️⃣ Insertar factura
            const [facturaResult] = await connection.query(
                "INSERT INTO factura (id_cliente, fecha_venta, total, total_iva, id_metodo) VALUES (?, NOW(), ?, ?, ?)",
                [id_cliente, total, totalIva, id_metodo]
            );

            const id_factura = facturaResult.insertId;

            // 3️⃣ Insertar detalles
            const detalles = productosValidos.map((p) => [
                id_factura,
                p.id_articulo,
                p.cantidad,
                p.precio
            ]);

            await connection.query(
                `INSERT INTO detalle_factura 
            (id_factura, id_articulo, cantidad, precio_unitario) 
            VALUES ?`,
                [detalles]
            );

            // 4️⃣ DESCONTAR STOCK (por cada producto)
            for (const p of productosValidos) {
                const { id_articulo, cantidad } = p;

                // Verificar stock antes de descontar
                const [row] = await connection.query(
                    "SELECT stock FROM articulos WHERE id_articulo = ?",
                    [id_articulo]
                );

                if (row.length === 0) throw new Error("Artículo no encontrado.");

                if (row[0].stock < cantidad) {
                    throw new Error(`Stock insuficiente para el artículo ID ${id_articulo}`);
                }

                // Descontar stock
                await connection.query(
                    "UPDATE articulos SET stock = stock - ? WHERE id_articulo = ?",
                    [cantidad, id_articulo]
                );
            }

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
                f.total_iva,
                c.id_cliente,
                c.cedula,
                c.nombre,
                c.correo,
                c.telefono,
                mp.nombre AS metodo_pago
            FROM factura f
            JOIN clientes c ON f.id_cliente = c.id_cliente
            JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
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
                    a.codigo_barras
                FROM detalle_factura df
                JOIN articulos a ON df.id_articulo = a.id_articulo
                WHERE df.id_factura = ?

            `, [id_factura]);

        // 3️⃣ Retornamos todo junto
        return { factura: factura[0], detalles };
    },

    getFacturas: async ({ cedula, id_factura }) => {

        let where = "";
        let params = [];

        if (cedula) {
            where = "WHERE c.cedula = ?";
            params.push(cedula);
        }

        if (id_factura) {
            where = "WHERE f.id_factura = ?";
            params = [id_factura];
        }

        const [facturas] = await pool.query(`
        SELECT
            f.id_factura,
            f.fecha_venta,
            f.total,
            f.total_iva,
            c.cedula,
            c.nombre,
            mp.nombre AS metodo_pago
        FROM factura f
        JOIN clientes c ON f.id_cliente = c.id_cliente
        JOIN metodo_pago mp ON f.id_metodo = mp.id_metodo
        ${where}
        ORDER BY f.fecha_venta DESC
    `, params);

        return facturas;
    },

    //Obtener facturas de la semana
    getWeek: async () => {
        const [rows] = await pool.query(`
            SELECT 
                f.id_factura,
                f.fecha_venta,
                f.total,
                f.total_iva,
                mp.nombre AS metodo_pago,
                c.cedula,
                c.nombre
            FROM factura f
            INNER JOIN metodo_pago mp 
                ON f.id_metodo = mp.id_metodo
            INNER JOIN clientes c
                ON f.id_cliente = c.id_cliente
            WHERE f.fecha_venta >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
              AND f.fecha_venta < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL 7 DAY
            ORDER BY f.id_factura DESC;
        `);

        return rows;
    },

    getMonth: async () => {
        const [rows] = await pool.query(`
            SELECT 
                f.id_factura,
                f.fecha_venta,
                f.total,
                f.total_iva,
                mp.nombre AS metodo_pago,
                c.cedula,
                c.nombre
            FROM factura f
            INNER JOIN metodo_pago mp 
                ON f.id_metodo = mp.id_metodo
            INNER JOIN clientes c
                ON f.id_cliente = c.id_cliente
            WHERE f.fecha_venta >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
              AND f.fecha_venta < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH
            ORDER BY f.id_factura DESC;
        `);
        return rows;
    }

};

module.exports = FacturaModel;
