const express = require('express');
const {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('../controllers/usuarios');

const tokenDeAutenticacao = require('../middleware/autenticacao');
const { createOrUpdateUserSchema, loginUserSchema,  } = require('../schemas/schema-user');
const validateRequestBody = require('../middleware/validate-request-body');

const rotas = express();

rotas.post('/usuario', validateRequestBody(createOrUpdateUserSchema), cadastrarUsuario);
rotas.post('/login', validateRequestBody(loginUserSchema), loginUsuario);

rotas.use(tokenDeAutenticacao);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validateRequestBody(createOrUpdateUserSchema), atualizarUsuario);

module.exports = rotas;
