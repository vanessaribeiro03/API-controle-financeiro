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
const validateRequestBody = require('../middleware/validate-request-body');
const { createOrUpdateTransactionSchema } = require('../schemas/schema-transactions');

const rotas = express();

rotas.use(tokenDeAutenticacao);

rotas.get('/transacao', listarTransacoes);
rotas.get('/transacao/extrato', obterExtrato);
rotas.get('/transacao/:id', detalharTransacao);
rotas.post('/transacao', validateRequestBody(createOrUpdateTransactionSchema), cadastrarTransacao);
rotas.put('/transacao/:id', validateRequestBody(createOrUpdateTransactionSchema), atualizarTransacao);
rotas.delete('/transacao/:id', excluirTransacao);

module.exports = rotas