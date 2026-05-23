const { sendResponse } = require('../utils/response.util');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 400;
    message = err.errors.map((e) => e.message).join(', ');
  }

  sendResponse(res, statusCode, false, message, err.stack && process.env.NODE_ENV === 'development' ? err.stack : {});
};

module.exports = errorHandler;
