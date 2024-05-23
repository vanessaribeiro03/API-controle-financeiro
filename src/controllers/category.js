const pool = require('../connection/pool');

const listCategorires = async (req, res) => {
    try {

        const { rows } = await pool.query('select * from categorias');

        return res.json(rows);

    } catch (error) {
        return res.status(500).json({ mensagem: "internal server error." });
    }
};

module.exports = listCategorires;