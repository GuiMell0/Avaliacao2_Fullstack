const Joi = require('joi');

const clothingBrandSchema = Joi.object({
  nome: Joi.string().min(2).max(120).required(),
  marca: Joi.string().min(2).max(100).required(),
  tipo: Joi.string().min(2).max(80).required(),
  tamanho: Joi.string().max(30).allow('', null),
  cor: Joi.string().max(50).allow('', null),
  quantidade: Joi.number().integer().min(1).default(1),
  valorEstimado: Joi.number().min(0).default(0),
  observacoes: Joi.string().max(500).allow('', null),
});

const updateClothingBrandSchema = clothingBrandSchema.fork(['nome', 'marca', 'tipo'], (field) => field.optional()).min(1);

module.exports = { clothingBrandSchema, updateClothingBrandSchema };
