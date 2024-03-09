const express = require('express');
const {
    listarTransacoes,
    obterExtrato,
    detalharTransacao,
    cadastrarTransacao,
    atualizarTransacao,
    excluirTransacao,
} = require('../controllers/transacoes');

const tokenDeAutenticacao = require('../middleware/autenticacao');

const rotas = express();

rotas.use(tokenDeAutenticacao);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', cadastrarTransacao);
rotas.put('/transacao/:id', atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas