const { sendResponse } = require('../utils/response.util');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return sendResponse(res, 400, false, errorMessage);
  }
  next();
};

module.exports = validate;
