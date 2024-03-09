const express = require('express');
const rotasUsuarios = require('./routes/usuarios');
const rotasCategorias = require('./routes/categorias');
const rotasTransacoes = require('./routes/transacoes');
const app = express();

app.use(express.json());

app.use(rotasUsuarios);
app.use(rotasCategorias);
app.use(rotasTransacoes);

app.listen(3000)