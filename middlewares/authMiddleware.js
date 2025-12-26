const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err && err.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: 'Token Expirado' })
            }

            if (err) {
                return res.status(403).json({ success: false, message: 'Token inválido' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.log("Error token", error)
    }

};

module.exports = authenticateToken;
