const pool = require('../connection/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const { rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: "There is already a registered user with the email provided." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *'

        const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

        const { senha: _, ...dadosDoUsuario } = rows[0];

        return res.status(201).json(dadosDoUsuario);

    } catch (error) {
        return res.status(500).json({ mensagem: "internal server error." });
    }
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const { rows, rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "invalid credentials" })
        }

        const { senha: senhaUsuario, ...usuario } = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "invalid credentials" })
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY);

        return res.json({
            usuario,
            token
        })

    } catch (error) {
        return res.status(500).json({ mensagem: "internal server error." });
    }
};

const detailUser = async (req, res) => {
    return res.json(req.usuario);
};

const updateUser = async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const { rowCount } = await pool.query('select * from usuarios where email = $1 and id != $2', [email, req.usuario.id]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: "The email provided is already being used by another user." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'
        const params = [nome, email, senhaCriptografada, req.usuario.id]

        await pool.query(query, params)

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "internal server error." });
    }
};

module.exports = {
    createUser,
    login,
    detailUser,
    updateUser
};
