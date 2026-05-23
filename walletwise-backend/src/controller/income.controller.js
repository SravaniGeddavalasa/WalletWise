const incomeService = require('../service/income.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.createIncome = catchAsync(async (req, res) => {
  const income = await incomeService.createIncome(req.user.id, req.body);
  sendResponse(res, 201, true, 'Income added successfully', income);
});

exports.updateIncome = catchAsync(async (req, res) => {
  try {
    const income = await incomeService.updateIncome(req.params.id, req.user.id, req.body);
    sendResponse(res, 200, true, 'Income updated successfully', income);
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.deleteIncome = catchAsync(async (req, res) => {
  try {
    await incomeService.deleteIncome(req.params.id, req.user.id);
    sendResponse(res, 200, true, 'Income deleted successfully');
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.getIncomes = catchAsync(async (req, res) => {
  const incomes = await incomeService.getIncomes(req.user.id, req.query);
  sendResponse(res, 200, true, 'Incomes retrieved successfully', incomes);
});

exports.getIncomeReports = catchAsync(async (req, res) => {
  const report = await incomeService.getIncomeReports(req.user.id);
  sendResponse(res, 200, true, 'Income report retrieved successfully', report);
});

exports.getMonthlyIncomes = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    res.status(400);
    throw new Error('Month and year are required');
  }
  const incomes = await incomeService.getMonthlyIncomes(req.user.id, month, year);
  sendResponse(res, 200, true, 'Monthly incomes retrieved successfully', incomes);
});
