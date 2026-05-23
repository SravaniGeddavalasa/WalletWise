const Joi = require('joi');

const createIncome = Joi.object({
  title: Joi.string().required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  date: Joi.date().iso().required(),
  description: Joi.string().allow('', null),
});

const updateIncome = Joi.object({
  title: Joi.string().optional(),
  amount: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  date: Joi.date().iso().optional(),
  description: Joi.string().allow('', null).optional(),
});

module.exports = {
  createIncome,
  updateIncome,
};
