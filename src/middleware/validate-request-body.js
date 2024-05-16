const validateRequestBody = joiSchema => async (req, res, next) => {
    try {
        await joiSchema.validateAsync(req.body)
        next()
    } catch (error) {
        return res.status(400).json({mensage: error.message})
    }
}

module.exports = validateRequestBody