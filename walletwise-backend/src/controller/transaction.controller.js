const transactionService = require('../service/transaction.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.getTransactions = catchAsync(async (req, res) => {
  const transactions = await transactionService.getTransactions(req.user.id, req.query);
  sendResponse(res, 200, true, 'Transactions retrieved successfully', transactions);
});
