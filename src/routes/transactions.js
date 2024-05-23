const express = require('express');
const { 
    listTransactions, 
    getExtract, 
    detailTransactions, 
    createTransactions, 
    updateTransactions, 
    removeTransactions 
} = require('../controllers/transactions');
const validateRequestBody = require('../middleware/validate-request-body');
const { createOrUpdateTransactionSchema } = require('../schemas/schema-transactions');
const authToken = require('../middleware/authentication');

const routes = express();

routes.use(authToken);

routes.get('/transacao', listTransactions);
routes.get('/transacao/extrato', getExtract);
routes.get('/transacao/:id', detailTransactions);
routes.post('/transacao', validateRequestBody(createOrUpdateTransactionSchema), createTransactions);
routes.put('/transacao/:id', validateRequestBody(createOrUpdateTransactionSchema), updateTransactions);
routes.delete('/transacao/:id', removeTransactions);

module.exports = routes