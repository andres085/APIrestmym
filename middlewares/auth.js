const jwt = require('jsonwebtoken');
const config = require('config');

let verificarToken = (req, res, next) => {
    let token = req.get('Authorization');
    jwt.verify(token, config.get('configToken.SEED'), (err, decode) => {
        if (err) {
            return res.status(401).json({
                err
            })
        }
        req.usuario = decode.usuario;
        next();
    })
}

module.exports = verificarToken;