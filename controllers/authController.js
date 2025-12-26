
const authModel = require('../models/authModel')
const empleadoMo = require('../models/empleadosModel')
const jwt = require('jsonwebtoken');

const authController = {

    async login(req, res) {
        try {
            const { cedula, password } = req.body;

            // OBLIGATORIOS
            if (!cedula || !password) {
                return res.status(400).json({
                    mensaje: "Cedula y contraseña son requeridas",
                })
            }

            // VERIFICAR CEDULA
            const empleado = await empleadoMo.getByCedula(cedula);
            if (!empleado) {
                return res.status(404).json({
                    mensaje: "La Cedula no existe",
                })
            }

            // VALIDAR CONTRASEÑA
            const response = await authModel.autenthicate(cedula, password);

            if (response.status === 'MAL_CONTRASEÑA') {
                return res.status(401).json({
                    mensaje: "Cedula o Contraseña incorrecta"
                })
            }

            if (response.status !== "OK") {
                return res.status(400).json({
                    mensaje: "ERROR INESPERADO",
                })
            }

            const user = response.user;

            //  Crear Token
            const token = jwt.sign({
                id: String(user.id),
                nombres: user.nombres,
                apellidos: user.apellidos,
                cedula: user.cedula,
            },
                process.env.JWT_SECRET,
                {
                    expiresIn: '8h'
                }
            )
            res.json({
                mensaje: `Login exitoso, ${user.cedula}`,
                token,
                user: {
                    cedula: user.cedula,
                    nombres: user.nombres,
                    apellidos: user.apellidos
                }
            });

        } catch (error) {
            console.error("Se ha presentando un error en el servidor", error)
            res.status(500).json({
                mensaje: "Error en el login",
            })
        }
    },

}


module.exports = authController;
