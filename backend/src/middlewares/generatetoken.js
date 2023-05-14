const jwt = require('jsonwebtoken');

const generateJWT = (usuario) =>{

    const api_key = process.env.API_KEY

    const payload = { id: usuario.id, user: usuario.user, rol: usuario.rol };
    const token = jwt.sign(payload, `${api_key}`, { expiresIn: "1d" });
    return token;
    
}

module.exports = {
    generateJWT
}