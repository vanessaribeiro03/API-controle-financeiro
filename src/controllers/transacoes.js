const pool = require('../connection/pool');

const listarTransacoes = async (req, res) => {
    const { filtro } = req.query;

    try {
        let arrayDosObjetos = [];

        if (filtro) {
            await pool.query('CREATE EXTENSION IF NOT EXISTS unaccent');

            const { rows } = await pool.query(`
                SELECT transacoes.*, categorias.descricao as categoria_nome
                FROM transacoes
                JOIN categorias ON transacoes.categoria_id = categorias.id
                WHERE unaccent(categorias.descricao) ILIKE unaccent($1) AND transacoes.usuario_id = $2;`,
                [`${filtro}%`, req.usuario.id]
            );

            arrayDosObjetos = rows

        } else {
            const { rows } = await pool.query(`
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            from transacoes t
            join categorias c on t.categoria_id = c.id
            where t.usuario_id = $1
            order by t.id`, [req.usuario.id])

            arrayDosObjetos = rows
        }

        return res.json(arrayDosObjetos);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const detalharTransacao = async (req, res) => {
    const { id } = req.params;

    try {

        const { rowCount } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        const { rows } = await pool.query(`
            select t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
            from transacoes t
            join categorias c on t.categoria_id = c.id
            where t.usuario_id = $1 and t.id = $2`, [req.usuario.id, id])

        return res.json(rows);

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        const { rowCount } = await pool.query('select * from categorias where id = $1', [categoria_id]);

        if (rowCount === 0) {
            return res.status(400).json({ mensagem: "Categoria não encontrada." });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "Tipo de transação inválida." })
        }

        const query = `insert into transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const params = [descricao, valor, data, categoria_id, req.usuario.id, tipo]

        await pool.query(query, params);

        const { rows } = await pool.query(`
        SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.id = $1;`, [req.usuario.id]);
       
        return res.json(rows);
        

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {

        const { rowCount: transacao } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        if (transacao === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        if (!descricao || !valor || !data || !categoria_id || !tipo) {
            return res.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser informados." });
        }

        const { rowCount: categoria } = await pool.query('select * from categorias where id = $1', [categoria_id]);

        if (categoria === 0) {
            return res.status(400).json({ mensagem: "Categoria não encontrada." });
        }

        if (tipo !== "entrada" && tipo !== "saida") {
            return res.status(400).json({ mensagem: "Tipo de transação inválida." })
        }

        const query = 'update transacoes set descricao = $1, valor = $2, data = $3, categoria_id = $4, tipo = $5 where id = $6';
        const params = [descricao, valor, data, categoria_id, tipo, id];

        await pool.query(query, params);

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const excluirTransacao = async (req, res) => {
    const { id } = req.params

    try {

        const { rowCount } = await pool.query('select * from transacoes where id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
        }

        await pool.query('delete from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        return res.status(204).send();

    } catch (error) {
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};

const obterExtrato = async (req, res) => {
    try {
        const { rows: entradas } = await pool.query('SELECT SUM(valor) as entrada FROM transacoes WHERE tipo = $1 AND usuario_id = $2', ['entrada', req.usuario.id]);
        const { rows: saidas } = await pool.query('SELECT SUM(valor) as saida FROM transacoes WHERE tipo = $1 AND usuario_id = $2', ['saida', req.usuario.id]);

        const extrato = {
            entrada: entradas[0].entrada || 0,
            saida: saidas[0].saida || 0
        };

        return res.status(200).json(extrato);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ mensagem: "Erro interno no servidor." });
    }
};

module.exports = {
    listarTransacoes,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
    obterExtrato
};