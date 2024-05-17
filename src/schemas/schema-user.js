const joi = require('joi')
const {regexPassword, fullName} = require('../utils/regex')
const {passwordInvalid, emailValid, firtsAndLastName, isRequired} = require('../utils/messages-error')

const createOrUpdateUserSchema = joi.object({
    nome: joi.string().pattern(new RegExp(fullName)).required().messages({
        'string.base': 'name must be a string',
        'string.pattern.base': firtsAndLastName,
        'any.required': isRequired
    }),

    email: joi.string().email().required().messages({
        'string.base': 'email must be a string',
        'string.email': emailValid,
        'any.required': isRequired
    }),

    senha: joi.string().pattern(new RegExp(regexPassword)).required().messages({
        'string.base': 'password must be a string',
        'string.pattern.base': passwordInvalid,
        'any.required': isRequired
    })
})

const loginUserSchema = joi.object({
    email: joi.required().messages({
        'any.required': isRequired
    }),

    senha: joi.required().messages({
        'any.required': isRequired
    })
})

module.exports = {
    createOrUpdateUserSchema,
    loginUserSchema,
}