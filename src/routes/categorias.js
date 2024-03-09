const express = require('express');
const listarCategorias = require('../controllers/categorias');
const tokenDeAutenticacao = require('../middleware/autenticacao');
const rotas = express();

rotas.use(tokenDeAutenticacao)

rotas.get('/categoria', listarCategorias);

module.exports = rotas