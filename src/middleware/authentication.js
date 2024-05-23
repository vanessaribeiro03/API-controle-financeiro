const jwt = require('jsonwebtoken');
const pool = require('../connection/pool');

const authToken = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: "To access this feature a valid authentication token must be sent." });
    }

    const token = authorization.split(' ')[1];

    try {

        const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { rows, rowCount } = await pool.query('select * from usuarios where id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "User not found." });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "To access this feature a valid authentication token must be sent." });
    }
};

module.exports = authToken;