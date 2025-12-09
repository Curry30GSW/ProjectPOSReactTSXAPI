const EmpleadosModel = require('../models/empleadosModel');


const EmpleadosController = {
    getEmpleados: async (req, res) => {
        try {
            const empleados = await EmpleadosModel.getAll();
            res.json(empleados);
        } catch (error) {
            console.error("❌ Error en getEmpleados:", error);
            res.status(500).json({ message: "Error al obtener empleados", error: error.message });
        }
    },


    crearEmpleado: async (req, res) => {
        try {
            const { cedula, nombres, apellidos, correo, password, telefono, cargo } = req.body;
            console.log("BODY RECIBIDO:", req.body);
            const estado = 1;

            if (!cedula || !nombres || !apellidos || !correo || !password || !telefono || !cargo) {
                return res.status(400).json({
                    message: "Faltan datos obligatorios"
                });
            }


            const existe = await EmpleadosModel.getByCedula(cedula);

            if (existe) {
                return res.status(400).json({ message: "La cédula ya está registrada en el sistema." });
            }

            // console.log("DATA RECIBIDA EN MODEL:", data);

            const data = { cedula, nombres, apellidos, correo, password, telefono, cargo, estado };
            const results = await EmpleadosModel.insert(req.body);


            res.json({ message: "Empleado registrado exitosamente.", results });
        } catch (error) {
            console.error("ERROR CONTROLLER:", error);
            res.status(500).json({ message: "Error al crear empleado", error });
        }
    },

    actualizarEmpleado: async (req, res) => {
        try {
            const id_empleado = req.params.id_empleado;
            const { cedula, nombres, apellidos, correo, password, telefono, cargo } = req.body;

            const duplicado = await EmpleadosModel.cedulaRepetida(cedula, id_empleado);
            if (duplicado.length > 0) {
                return res.status(400).json({ message: "La cédula ya está registrada para otro empleado." });
            }

            const results = await EmpleadosModel.update(id_empleado, req.body);
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
