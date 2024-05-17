const joi = require('joi');
const { isRequired, isNumber } = require('../utils/messages-error');

const createOrUpdateTransactionSchema = joi.object({
    descricao: joi.string().required().messages({
        'string.base': 'description must be a string',
        'any.required': isRequired
    }),

    valor: joi.number().integer().required().messages({
        'number.base': isNumber,
        'any.required': isRequired
    }),

    data: joi.string().messages({
        'string.base': 'date must be a string',
    }),

    categoria_id: joi.string().required().messages({
        'string.base': 'categoria_id must be a string',
        'any.required': isRequired
    }),

    tipo: joi.string().valid('entrada', 'saida').insensitive().required().messages({
        'any.only': 'type must be input or output',
        'any.required': isRequired
    })
});

module.exports = {
    createOrUpdateTransactionSchema
}