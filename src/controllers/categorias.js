const pool = require('../connection/pool');

const listarCategorias = async (req, res) => {
    try {

        const { rows } = await pool.query('select * from categorias');

        return res.json(rows);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

module.exports = listarCategorias;