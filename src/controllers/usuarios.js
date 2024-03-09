const pool = require('../connection/pool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        const { rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *'

        const { rows } = await pool.query(query, [nome, email, senhaCriptografada]);

        const { senha: _, ...dadosDoUsuario } = rows[0];

        return res.status(201).json(dadosDoUsuario);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {

        if (!email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        const { rows, rowCount } = await pool.query('select * from usuarios where email = $1', [email]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const { senha: senhaUsuario, ...usuario } = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, senhaUsuario)

        if (!senhaCorreta) {
            return res.status(401).json({ mensagem: "Usuário e/ou senha inválido(s)." })
        }

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET_KEY);

        return res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const detalharUsuario = async (req, res) => {
    return res.json(req.usuario);
};

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    try {

        if (!nome || !email || !senha) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        const { rowCount } = await pool.query('select * from usuarios where email = $1 and id != $2', [email, req.usuario.id]);

        if (rowCount > 0) {
            return res.status(400).json({ mensagem: "O e-mail informado já está sendo utilizado por outro usuário." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const query = 'update usuarios set nome = $1, email = $2, senha = $3 where id = $4'
        const params = [nome, email, senhaCriptografada, req.usuario.id]

        await pool.query(query, params)

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
};
