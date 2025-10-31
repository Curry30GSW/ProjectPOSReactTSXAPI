const pool = require('../config/db');

const ClienteModel = {
  // Obtener todos los clientes
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM clientes");
    return rows;
  },

  // Obtener cliente por ID
  getById: async (id_cliente) => {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE id_cliente = ?",
      [id_cliente]
    );
    return rows[0];
  },

  // Insertar un nuevo cliente
  insert: async (data) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Validar si ya existe cédula
      const [existe] = await connection.query(
        "SELECT COUNT(*) AS count FROM clientes WHERE cedula = ?",
        [data.cedula]
      );

      if (existe[0].count > 0) {
        throw new Error("La cédula ya está registrada en el sistema.");
      }

      const query = `
                INSERT INTO clientes (cedula, nombre, correo, telefono)
                VALUES (?, ?, ?, ?)
            `;
      const values = [
        data.cedula || null,
        data.nombre || null,
        data.correo || null,
        data.telefono || null,
      ];

      const [result] = await connection.query(query, values);
      await connection.commit();

      return { id_cliente: result.insertId, ...data };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Actualizar cliente
  update: async (id_cliente, data) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Verificar existencia
      const [existe] = await connection.query(
        "SELECT id_cliente FROM clientes WHERE id_cliente = ?",
        [id_cliente]
      );
      if (existe.length === 0) throw new Error("Cliente no encontrado.");

      // Verificar duplicidad de cédula
      const [duplicado] = await connection.query(
        "SELECT id_cliente FROM clientes WHERE cedula = ? AND id_cliente != ?",
        [data.cedula, id_cliente]
      );
      if (duplicado.length > 0) {
        throw new Error("La cédula ya está registrada para otro cliente.");
      }

      const updateQuery = `
                UPDATE clientes
                SET cedula = ?, nombre = ?, correo = ?, telefono = ?
                WHERE id_cliente = ?
            `;
      await connection.query(updateQuery, [
        data.cedula,
        data.nombre,
        data.correo,
        data.telefono,
        id_cliente,
      ]);

      await connection.commit();
      return { message: "Cliente actualizado correctamente" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Eliminar cliente
  delete: async (id_cliente) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const [existe] = await connection.query(
        "SELECT id_cliente FROM clientes WHERE id_cliente = ?",
        [id_cliente]
      );
      if (existe.length === 0) throw new Error("Cliente no encontrado.");

      await connection.query(
        "DELETE FROM clientes WHERE id_cliente = ?",
        [id_cliente]
      );

      await connection.commit();
      return { message: "Cliente eliminado correctamente" };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // Buscar cliente por cédula o nombre
  buscar: async (query) => {
    const [rows] = await pool.query(
      `
            SELECT * FROM clientes
            WHERE cedula = ? OR nombre LIKE CONCAT('%', ?, '%')
            `,
      [query, query]
    );
    return rows;
  },

  // Buscar nombre por cédula (endpoint especial)
  getByCedula: async (cedula) => {
    const [rows] = await pool.query(
      "SELECT nombre FROM clientes WHERE cedula = ?",
      [cedula]
    );
    return rows[0] || { nombre: "-" };
  },
};

module.exports = ClienteModel;
