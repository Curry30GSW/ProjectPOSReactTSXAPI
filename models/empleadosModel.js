const pool = require('../config/db');
const bcrypt = require('bcryptjs')

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
        try {
            const [rows] = await pool.query("SELECT * FROM empleados WHERE cedula = ?", [cedula]);
        return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("se ha presentado un error", error)
        }
    },



        // Insertar nuevo empleado
        insert: async (data) => {
            try {

                // hashear password
                const hash = 10;
                const hashedPassword = await bcrypt.hash(data.password,hash)
                const [result] = await pool.query(
                `INSERT INTO empleados (cedula, nombres, apellidos, correo, password, telefono, cargo, estado)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [data.cedula, data.nombres, data.apellidos, data.correo, hashedPassword, data.telefono, data.cargo, data.estado ?? 1]
            );
                // const isMath=  await bcrypt.compare(password, data.password)
                
                // contraseña incorrecta
            // if(!isMath){
            //         return null;
            // }

            const empleado= { id_empleado: result.insertId, ...data, password: undefined };

            return empleado;


            } catch (error) {
                    console.error("ERROR MODEL:", error);
                throw error;
                
            }
        },

    // Actualizar empleado existente
    update: async (id_empleado, data) => {
         // contraseña nueva
        if(data.password && data.password != ""){
            // hashear password
            const hash = 10;
            data.password = await bcrypt.hash(data.password,hash)

            await pool.query(
                `UPDATE empleados 
                SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, password=?, telefono = ?, cargo = ?, estado = ?
                WHERE id_empleado = ?`,
                [data.cedula, data.nombres, data.apellidos, data.correo, data.password, data.telefono, data.cargo, data.estado, id_empleado]);

        } else {
            // Si no se envia contraseña, no sobreescribir
            await pool.query(
                `UPDATE empleados 
                SET cedula = ?, nombres = ?, apellidos = ?, correo = ?, telefono = ?, cargo = ?, estado = ?
                WHERE id_empleado = ?`,
                [data.cedula, data.nombres, data.apellidos, data.correo, data.telefono, data.cargo, data.estado, id_empleado]);

        }
            // const isMath=  await bcrypt.compare(password, data.password)
            // if(!isMath){
            //     return null
            // }

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
