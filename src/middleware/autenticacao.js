const jwt = require('jsonwebtoken');
const pool = require('../connection/pool');

const tokenDeAutenticacao = async (req, res, next) => {
    const { authorization } = req.headers;

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {

        const { id } = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { rows, rowCount } = await pool.query('select * from usuarios where id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado" });
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({ mensagem: "Credenciais inválidas" });
    }
};

module.exports = tokenDeAutenticacao;