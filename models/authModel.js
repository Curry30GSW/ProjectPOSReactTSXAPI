const pool = require('../config/db')
const bcrypt = require('bcryptjs')


const authModel = {
    autenthicate : async (cedula, password) => {
        try {
            // const query = `SELECT cedula, nombres, correo, password from empleados WHERE LOWER(TRIM(cedula)) = LOWER(TRIM(?)) AND TRIM(password) = TRIM(?)`
            
            // encriptacion de contraseña
            const query = `SELECT cedula, nombres, correo, password from empleados WHERE LOWER(TRIM(cedula)) = LOWER(TRIM(?))`
            const [users] = await pool.query(query, [cedula])

            // const [users] = await pool.query(query, [cedula, password]  )

            if(users.length === 0)
            {
                return null;
            }   
            // return users[0]

            const user = users[0];
            // para encriptar la contraseña
           const isMath=  await bcrypt.compare(password, user.password)
            // contraseña incorrecta
            if(!isMath){
                return null;
            }

            return  user
        } catch (error) {   
            console.error("Error de authenticacion", error)
            throw(error)
        }


    }
}

module.exports = authModel;