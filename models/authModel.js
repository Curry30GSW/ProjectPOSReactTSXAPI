const pool = require('../config/db')
const bcrypt = require('bcryptjs')


const authModel = {
    autenthicate: async (cedula, password) => {
        try {

            const query = `SELECT cedula, nombres, apellidos, correo, password from empleados WHERE LOWER(TRIM(cedula)) = LOWER(TRIM(?))`
            const [users] = await pool.query(query, [cedula])

            if (users.length === 0) {
                return { status: 'NO_CEDULA' };
            }

            const user = users[0];
            // para encriptar la contraseña
            const isMath = await bcrypt.compare(password, user.password)
            // contraseña incorrecta
            if (!isMath) {
                return { status: 'MAL_CONTRASEÑA' };;
            }

            return {
                status: 'OK',
                user
            }

        } catch (error) {
            console.error("Error de authenticacion", error)
            throw (error)
        }


    }
}

module.exports = authModel;