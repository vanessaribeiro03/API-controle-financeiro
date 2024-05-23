const express = require('express');
const listCategorires = require('../controllers/category');
const authToken = require('../middleware/authentication');
const routes = express();

routes.use(authToken)

routes.get('/categoria', listCategorires);

module.exports = routes