const Joi = require('joi');

const createUserSchema = Joi.object({
  nome: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(160).required(),
  senha: Joi.string().min(8).max(72).required(),
  role: Joi.string().valid('admin', 'user').default('user'),
});

const updateUserSchema = Joi.object({
  nome: Joi.string().min(2).max(120),
  email: Joi.string().email().max(160),
  senha: Joi.string().min(8).max(72),
  role: Joi.string().valid('admin', 'user'),
}).min(1);

module.exports = { createUserSchema, updateUserSchema };
