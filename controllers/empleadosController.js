const EmpleadosModel = require('../models/empleadosModel');


const EmpleadosController = {
    getEmpleados: async (req, res) => {
        try {
            const empleados = await EmpleadosModel.getActivos();
            res.json(empleados);
        } catch (error) {
            console.error("❌ Error en getEmpleados:", error);
            res.status(500).json({ message: "Error al obtener empleados", error: error.message });
        }
    },


    crearEmpleado: async (req, res) => {
        try {
            const { cedula, nombres, apellidos, correo, telefono, cargo } = req.body;
            const estado = 1;

            const existe = await EmpleadosModel.getByCedula(cedula);
            if (existe.length > 0) {
                return res.status(400).json({ message: "La cédula ya está registrada en el sistema." });
            }

            const data = { cedula, nombres, apellidos, correo, telefono, cargo, estado };
            const results = await EmpleadosModel.insert(data);
            res.json({ message: "Empleado registrado exitosamente.", results });
        } catch (error) {
            res.status(500).json({ message: "Error al crear empleado", error });
        }
    },

    actualizarEmpleado: async (req, res) => {
        try {
            const id_empleado = req.params.id_empleado;
            const { cedula, nombres, apellidos, correo, telefono, cargo } = req.body;

            const duplicado = await EmpleadosModel.cedulaRepetida(cedula, id_empleado);
            if (duplicado.length > 0) {
                return res.status(400).json({ message: "La cédula ya está registrada para otro empleado." });
            }

            const results = await EmpleadosModel.update(id_empleado, { cedula, nombres, apellidos, correo, telefono, cargo });
            res.json({ message: "Empleado actualizado correctamente", results });
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar empleado", error });
        }
    },

    inactivarEmpleado: async (req, res) => {
        try {
            const id_empleado = req.params.id_empleado;
            const results = await EmpleadosModel.inactivar(id_empleado);
            res.json({ message: "Empleado desactivado correctamente", results });
        } catch (error) {
            res.status(500).json({ message: "Error al desactivar empleado", error });
        }
    }
};

module.exports = EmpleadosController;
