const pool = require('../config/db');

const EmpleadosModel = {
    // Obtener todos los empleados
    getAll: async () => {
        const [rows] = await pool.query("SELECT * FROM empleados");
        return rows;
    },

    // Obtener empleados activos
    getActivos: async () => {
        const [rows] = await pool.query("SELECT * FROM empleados WHERE estado = 1");
        return rows;
    },

    // Obtener empleado por cédula
    getByCedula: async (cedula) => {
        const [rows] = await pool.query("SELECT * FROM empleados WHERE cedula = ?", [cedula]);
        return rows[0];
    },

    // Insertar nuevo empleado
    insert: async (data) => {
        const [result] = await pool.query(
            `INSERT INTO empleados (cedula, nombres, apellidos, correo, telefono, cargo, estado)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.cedula, data.nombres, data.apellidos, data.correo, data.telefono, data.cargo, data.estado ?? 1]
        );
        return { id_empleado: result.insertId, ...data };
    },

    // Actualizar empleado existente
    update: async (id_empleado, data) => {
        await pool.query(
            `UPDATE empleados 
             SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, cargo = ?, estado = ?
             WHERE id_empleado = ?`,
            [data.cedula, data.nombres, data.apellidos, data.correo, data.telefono, data.cargo, data.estado, id_empleado]
        );
        return { message: "Empleado actualizado correctamente" };
    },

    // Inactivar empleado
    inactivar: async (id_empleado) => {
        await pool.query("UPDATE empleados SET estado = 0 WHERE id_empleado = ?", [id_empleado]);
        return { message: "Empleado inactivado correctamente" };
    },

    // Validar si una cédula ya existe (para evitar duplicados)
    cedulaRepetida: async (cedula, id_empleado = null) => {
        let sql = "SELECT id_empleado FROM empleados WHERE cedula = ?";
        const params = [cedula];
        if (id_empleado) {
            sql += " AND id_empleado != ?";
            params.push(id_empleado);
        }
        const [rows] = await pool.query(sql, params);
        return rows.length > 0;
    },
};

module.exports = EmpleadosModel;
