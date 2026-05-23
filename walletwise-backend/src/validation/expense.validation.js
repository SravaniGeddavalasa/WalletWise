const Joi = require('joi');

const createExpense = Joi.object({
  title: Joi.string().required(),
  amount: Joi.number().positive().required(),
  category: Joi.string().required(),
  description: Joi.string().allow('', null),
  date: Joi.date().iso().required(),
  receiptUrl: Joi.string().allow('', null),
});

const updateExpense = Joi.object({
  title: Joi.string().optional(),
  amount: Joi.number().positive().optional(),
  category: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  date: Joi.date().iso().optional(),
  receiptUrl: Joi.string().allow('', null).optional(),
});

module.exports = {
  createExpense,
  updateExpense,
};
