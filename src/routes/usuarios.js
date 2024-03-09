const express = require('express');
const {
    cadastrarUsuario,
    loginUsuario,
    detalharUsuario,
    atualizarUsuario
} = require('../controllers/usuarios');

const tokenDeAutenticacao = require('../middleware/autenticacao');

const rotas = express();

rotas.post('/usuario', cadastrarUsuario);
rotas.post('/login', loginUsuario);

rotas.use(tokenDeAutenticacao);

rotas.get('/usuario', detalharUsuario);
rotas.put('/usuario', atualizarUsuario);

module.exports = rotas;
