const Joi = require('joi');

const register = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow('', null),
  password: Joi.string().min(6).required(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

const resetPassword = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).optional(),
  newPassword: Joi.string().min(6).optional(),
});

const changePassword = Joi.object({
  currentPassword: Joi.string().optional(),
  oldPassword: Joi.string().optional(),
  newPassword: Joi.string().min(6).required(),
});

const updateProfile = Joi.object({
  name: Joi.string().optional().allow('', null),
  phone: Joi.string().optional().allow('', null),
  address: Joi.string().optional().allow('', null),
  avatar: Joi.string().optional().allow('', null),
});

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
