const express = require('express');
const userRoutes = require('./routes/users');
const categoriresRoutes = require('./routes/category');
const transactionsRoutes = require('./routes/transactions');
const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(categoriresRoutes);
app.use(transactionsRoutes);

app.listen(3000)