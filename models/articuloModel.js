const pool = require('../config/db');
const { getAll, getById, insert } = require('./clientesModel');


const ArticuloModel = {
    // // Obtener todos los artículos
    getAll: async () => {
        const [rows] = await pool.query("SELECT * FROM articulos");
        return rows;
    },


    // Obtener un artículo por ID
    getById: async (id_articulo) => {
        const [rows] = await pool.query(
            "SELECT * FROM articulos WHERE id_articulo = ?",
            [id_articulo]
        );
        return rows[0];
    },

    // Insertar un nuevo artículo
    insert: async (data) => {
        const connection = await pool.getConnection()

        try {
            await connection.beginTransaction()

            const [existe] = await connection.query(
                "SELECT COUNT (*) AS count FROM  articulos WHERE codigo_barras = ?", [data.codigo_barras]);

            if (existe[0].count > 0) {
                throw new Error("Hay un articulo con ese codigo de barras")
            }

            const limpiarValor = (valor) => {
                if (valor === null || valor === undefined) return null;
                if (typeof valor === "number") return valor;
                return parseFloat(valor.toString().replace(/[^\d.]/g, "")) || 0;
            };


            const query = `INSERT INTO articulos (descripcion, precio, stock, peso, codigo_barras) VALUES (?,?,?,?,?)`;

            const values = [
                data.descripcion || null,
                limpiarValor(data.precio),
                parseInt(data.stock) || 0,
                limpiarValor(data.peso),
                data.codigo_barras || null,
            ]

            const [result] = await connection.query(query, values);

            await connection.commit()
            return { id_articulo: result.insertId, ...data }

        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }


    },
    // Actualizar artículo
    update: async (id_articulo, data) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [existe] = await connection.query(
                "SELECT id_articulo FROM articulos WHERE id_articulo = ?",
                [id_articulo]
            );
            if (existe.length === 0) throw new Error("Artículo no encontrado");

            const updateQuery = `
        UPDATE articulos 
        SET codigo_barras = ?, descripcion = ?, precio = ?, stock = ?, peso = ?
        WHERE id_articulo = ?
      `;

            await connection.query(updateQuery, [
                data.codigo_barras,
                data.descripcion,
                data.precio,
                data.stock,
                data.peso,
                id_articulo,
            ]);

            await connection.commit();
            return { message: "Artículo actualizado correctamente" };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Eliminar artículo
    delete: async (id_articulo) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [existe] = await connection.query(
                "SELECT id_articulo FROM articulos WHERE id_articulo = ?",
                [id_articulo]
            );
            if (existe.length === 0) throw new Error("Artículo no encontrado");

            await connection.query(
                "DELETE FROM articulos WHERE id_articulo = ?",
                [id_articulo]
            );

            await connection.commit();
            return { message: "Artículo eliminado correctamente" };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    // Buscar artículo por código o descripción
    buscar: async (q) => {
        const like = `%${q}%`;

        const [rows] = await pool.query(
            `
            SELECT * FROM articulos
            WHERE codigo_barras LIKE ? 
               OR descripcion LIKE ?
            `,
            [like, like]
        );
        return rows;
    },
};

module.exports = ArticuloModel;