const pool = require('../config/db');

const ProveedorModel = {
    // Obtener todos los proveedores
    getAll: async () => {
        const [rows] = await pool.query("SELECT * FROM proveedor");
        return rows;
    },

    // Obtener proveedor por ID
    getById: async (id_proveedor) => {
        const [rows] = await pool.query(
            "SELECT * FROM proveedor WHERE id_proveedor = ?",
            [id_proveedor]
        );
        return rows[0];
    },

    // Insertar nuevo proveedor
    insert: async (data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Validar si ya existe la cédula
            const [existe] = await connection.query(
                "SELECT COUNT(*) AS count FROM proveedor WHERE cedula = ?",
                [data.cedula]
            );

            if (existe[0].count > 0) {
                throw new Error("La cédula ya está registrada en la base de datos.");
            }

            const query = `
                INSERT INTO proveedor (cedula, nombre, correo, telefono, detalles)
                VALUES (?, ?, ?, ?, ?)
            `;
            const values = [
                data.cedula || null,
                data.nombre || null,
                data.correo || null,
                data.telefono || null,
                data.detalles || null,
            ];

            const [result] = await connection.query(query, values);
            await connection.commit();

            return { id_proveedor: result.insertId, ...data };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Actualizar proveedor
    update: async (id_proveedor, data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // Validar existencia
            const [existe] = await connection.query(
                "SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?",
                [id_proveedor]
            );
            if (existe.length === 0) throw new Error("Proveedor no encontrado.");

            // Verificar duplicidad de cédula
            const [duplicado] = await connection.query(
                "SELECT id_proveedor FROM proveedor WHERE cedula = ? AND id_proveedor != ?",
                [data.cedula, id_proveedor]
            );
            if (duplicado.length > 0) {
                throw new Error("La cédula ya está registrada para otro proveedor.");
            }

            const updateQuery = `
                UPDATE proveedor 
                SET cedula = ?, nombre = ?, correo = ?, telefono = ?, detalles = ?
                WHERE id_proveedor = ?
            `;

            await connection.query(updateQuery, [
                data.cedula,
                data.nombre,
                data.correo,
                data.telefono,
                data.detalles,
                id_proveedor,
            ]);

            await connection.commit();
            return { message: "Proveedor actualizado correctamente" };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Eliminar proveedor
    delete: async (id_proveedor) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [existe] = await connection.query(
                "SELECT id_proveedor FROM proveedor WHERE id_proveedor = ?",
                [id_proveedor]
            );
            if (existe.length === 0) throw new Error("Proveedor no encontrado.");

            await connection.query(
                "DELETE FROM proveedor WHERE id_proveedor = ?",
                [id_proveedor]
            );

            await connection.commit();
            return { message: "Proveedor eliminado correctamente" };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Buscar proveedor por cédula o nombre
    buscar: async (query) => {
        const [rows] = await pool.query(
            `
            SELECT * FROM proveedor
            WHERE cedula = ? OR nombre LIKE CONCAT('%', ?, '%')
            `,
            [query, query]
        );
        return rows;
    },
};

module.exports = ProveedorModel;
