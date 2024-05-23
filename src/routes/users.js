const express = require('express');
const { 
    createUser, 
    login, 
    detailUser, 
    updateUser
} = require('../controllers/users');
const { createOrUpdateUserSchema, loginUserSchema,  } = require('../schemas/schema-user');
const validateRequestBody = require('../middleware/validate-request-body');
const authToken = require('../middleware/authentication');

const routes = express();

routes.post('/usuario', validateRequestBody(createOrUpdateUserSchema), createUser);
routes.post('/login', validateRequestBody(loginUserSchema), login);

routes.use(authToken);

routes.get('/usuario', detailUser);
routes.put('/usuario', validateRequestBody(createOrUpdateUserSchema), updateUser);

module.exports = routes;
