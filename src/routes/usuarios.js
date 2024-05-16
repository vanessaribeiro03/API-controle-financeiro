const express = require('express');
const {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('../controllers/usuarios');

const tokenDeAutenticacao = require('../middleware/autenticacao');
const { createUserSchema, loginUserSchema, updateUserSchema } = require('../schemas/schema-user');
const validateRequestBody = require('../middleware/validate-request-body');

const rotas = express();

rotas.post('/usuario', validateRequestBody(createUserSchema), cadastrarUsuario);
rotas.post('/login', validateRequestBody(loginUserSchema), loginUsuario);

rotas.use(tokenDeAutenticacao);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', validateRequestBody(updateUserSchema), atualizarUsuario);

module.exports = rotas;
