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

    getEmpleadosByCedula: async (req, res) => {
        try {
            const { cedula } = req.params

            if (!cedula) {
                return res.status(400).json({
                    message: "La cédula es requerida"
                });
            }

            const empleados = await EmpleadosModel.getByCedula(cedula);
            if (!empleados) {
                return res.status(400).json({
                    message: "El empleado no existe"
                });
            }

            res.json(empleados);
        } catch (error) {
            console.error("❌ Error en getEmpleados:", error);
            res.status(500).json({ message: "Error al obtener empleados", error: error.message });
        }
    },


    crearEmpleado: async (req, res) => {
        try {
            const { cedula, nombres, apellidos, correo, password, telefono, cargo } = req.body;
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

            const passwordPlano = cedula.toString()

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(passwordPlano, salt);

            const data = { cedula, nombres, apellidos, correo, passwordHash, telefono, cargo, estado };
            const results = await EmpleadosModel.insert(data);


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

    eliminarFoto: async (req, res) => {
        try {
            const { cedula } = req.params;

            await EmpleadosModel.updateFotoPerfil(cedula, null);

            res.json({
                message: "Foto de perfil eliminada correctamente",
                foto_perfil: null
            });
        } catch (error) {
            res.status(500).json({
                message: "Error al eliminar foto",
                error: error.message
            });
        }
    },

    actualizarFoto: async (req, res) => {
        try {

            const { cedula } = req.params;

            if (!req.files || !req.files.foto_perfil) {
                return res.status(400).json({
                    message: "No se envio datos de la foto"
                });
            }

            const foto = req.files.foto_perfil[0];

            const rutaFoto = `/uploads/fotoPerfil/${foto.filename}`;

            await EmpleadosModel.updateFotoPerfil(cedula, rutaFoto);

            res.json({
                message: "Foto de perfil actualizada correctamente",
                foto_perfil: rutaFoto
            })

        } catch (error) {
            res.status(500).json({ message: "Error al actualizar foto", error });

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
