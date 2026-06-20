const Joi = require('joi');

const carSchema = Joi.object({
  nome: Joi.string().min(2).max(120).required(),
  marca: Joi.string().min(2).max(80).required(),
  modelo: Joi.string().min(1).max(80).required(),
  ano: Joi.number().integer().min(1886).max(2100).required(),
  placa: Joi.string().max(12).allow('', null),
  cor: Joi.string().max(50).allow('', null),
  valorEstimado: Joi.number().min(0).default(0),
  observacoes: Joi.string().max(500).allow('', null),
});

const updateCarSchema = carSchema.fork(['nome', 'marca', 'modelo', 'ano'], (field) => field.optional()).min(1);

module.exports = { carSchema, updateCarSchema };
