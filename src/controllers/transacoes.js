const pool = require('../connection/pool');
const { createOrUpdateTransactionSchema } = require('../schemas/schema-transactions');

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
    let { descricao, valor, data, categoria_id, tipo } = req.body;
  
    try {   
      const { error, value } = createOrUpdateTransactionSchema.validate(req.body, { convert: false });

      if (error) {
        return res.status(400).json({ mensage: error.details[0].message });
      }

      const { rowCount } = await pool.query('select * from categorias where id = $1', [categoria_id]);
  
      if (rowCount === 0) {
        return res.status(400).json({ mensagem: "Categoria não encontrada." });
      }
  
      if (tipo.toLowerCase() !== "entrada" && tipo.toLowerCase() !== "saida") {
        return res.status(400).json({ mensagem: "Tipo de transação inválida." });
      }
  
      const query = data
        ? `INSERT INTO transacoes (descricao, valor, data, categoria_id, usuario_id, tipo) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`
        : `INSERT INTO transacoes (descricao, valor, categoria_id, usuario_id, tipo) 
           VALUES ($1, $2, $3, $4, $5) RETURNING *`;

      const params = data
        ? [descricao, valor, data, categoria_id, req.usuario.id, tipo]
        : [descricao, valor, categoria_id, req.usuario.id, tipo];
  
      const { rows } = await pool.query(query, params);
      
      const transacaoId = rows[0].id;
  
      const transacaoCompleta = await pool.query(`
        SELECT t.id, t.tipo, t.descricao, t.valor, t.data, t.usuario_id, t.categoria_id, c.descricao as categoria_nome
        FROM transacoes t
        JOIN categorias c ON t.categoria_id = c.id
        WHERE t.id = $1;`, [transacaoId]);
  
      return res.json(transacaoCompleta.rows[0]);
      
    } catch (error) {
      return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
};

const atualizarTransacao = async (req, res) => {
    const { id } = req.params;
    const { descricao, valor, data, categoria_id, tipo } = req.body;

    try {

        const { error, value } = createOrUpdateTransactionSchema.validate(req.body, { convert: false });

        if (error) {
            return res.status(400).json({ mensage: error.details[0].message });
        }

        const { rowCount: transacao } = await pool.query('select * from transacoes where id = $1 and usuario_id = $2', [id, req.usuario.id]);

        if (transacao === 0) {
            return res.status(404).json({ mensagem: "Transação não encontrada." });
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
        const extratoQuery = ` 
        SELECT tipo, SUM(CASE WHEN tipo = 'entrada' THEN valor ELSE 0 END) as entrada, 
        SUM(CASE WHEN tipo = 'saida' THEN valor ELSE 0 END) as saida
        FROM transacoes WHERE usuario_id = $1 GROUP BY tipo`;
        const {rows} = await pool.query(extratoQuery, [req.usuario.id])

        const transacoesQuery = `
            SELECT * FROM transacoes WHERE usuario_id = $1 AND tipo IN ('entrada', 'saida')
        `;
        const { rows: transacoes } = await pool.query(transacoesQuery, [req.usuario.id]);
        
        const extrato = {
            entrada: {
                total: 0,
                transacoes: []
            },
            saida: {
                total: 0,
                transacoes: []
            } 
        };

        rows.forEach(row => {
            if (row.tipo === 'entrada') {
                extrato.entrada.total = row.entrada;
            } else if (row.tipo === 'saida') {
                extrato.saida.total = row.saida;
            }
        });

        transacoes.forEach(transacao => {
            if (transacao.tipo === 'entrada') {
                extrato.entrada.transacoes.push(transacao);
            } else if (transacao.tipo === 'saida') {
                extrato.saida.transacoes.push(transacao);
            }
        });

        return res.status(200).json(extrato);

    } catch (error) {
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