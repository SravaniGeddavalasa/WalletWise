const Joi = require('joi');

const createBudget = Joi.object({
  category: Joi.string().required(),
  limit: Joi.number().positive().required(),
  warning_percentage: Joi.number().min(1).max(100).optional(),
  month: Joi.number().min(1).max(12).required(),
  year: Joi.number().required(),
  period: Joi.string().optional(),
});

const updateBudget = Joi.object({
  limit: Joi.number().positive().optional(),
  warning_percentage: Joi.number().min(1).max(100).optional(),
  period: Joi.string().optional(),
  month: Joi.number().min(1).max(12).optional(),
  year: Joi.number().optional(),
});

module.exports = {
  createBudget,
  updateBudget,
};
