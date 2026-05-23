const dashboardService = require('../service/dashboard.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.getSummary = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const summary = await dashboardService.getSummary(req.user.id, month, year);
  sendResponse(res, 200, true, 'Dashboard summary retrieved', summary);
});

exports.getCategoryReport = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const report = await dashboardService.getCategoryReport(req.user.id, month, year);
  sendResponse(res, 200, true, 'Category report retrieved', report);
});

exports.getRecentTransactions = catchAsync(async (req, res) => {
  const transactions = await dashboardService.getRecentTransactions(req.user.id);
  sendResponse(res, 200, true, 'Recent transactions retrieved', transactions);
});
