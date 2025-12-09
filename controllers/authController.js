
const authModel = require('../models/authModel')
const jwt = require('jsonwebtoken');

const authController = {

 async  login(req, res)  {
    try {
            // falta
            console.log(req.body)
            const {cedula, password} = req.body;

            if(!cedula || !password){
                return res.status(400).json({
            mensaje: "Cedula y contraseña son requeridas", }) 
            }   

        const response = await authModel.autenthicate(cedula, password);
        // if(!user){
        //     return res.status(401).json({
        //     mensaje: "Usuario y contraseña son incorrectas"}) 
        // }

        if(!response){ 
             return res.status(401).json({
            mensaje: "Usuario y contraseña incorrecta", }) 
        }

        //  Crear Token
        const token = jwt.sign({
            id: String(response.id),
            nombres:response.nombres,
            cedula:response.cedula,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '15m'
        }
    )
        res.json({
                mensaje: `Login exitoso, ${response.cedula}`,
                token,
                cedula: response.cedula,
                nombres: response.nombres,
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
