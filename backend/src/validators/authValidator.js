const Joi = require('joi');

const registerSchema = Joi.object({
  nome: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(160).required(),
  senha: Joi.string().min(8).max(72).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().max(160).required(),
  senha: Joi.string().min(8).max(72).required(),
});

module.exports = { registerSchema, loginSchema };
