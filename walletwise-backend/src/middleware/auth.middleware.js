const { verifyToken } = require('./jwt.middleware');
const { sendResponse } = require('../utils/response.util');
const { User } = require('../model');

const isAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendResponse(res, 401, false, 'Not authorized to access this route');
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return sendResponse(res, 401, false, 'The user belonging to this token does no longer exist.');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendResponse(res, 401, false, 'Not authorized, token failed');
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return sendResponse(res, 403, false, `User role ${req.user.role} is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { isAuth, authorize };
