const expenseService = require('../service/expense.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.createExpense = catchAsync(async (req, res) => {
  let data = req.body;
  if (req.file) {
    data.receipt_image = req.file.path;
  }
  const expense = await expenseService.createExpense(req.user.id, data);
  sendResponse(res, 201, true, 'Expense added successfully', expense);
});

exports.updateExpense = catchAsync(async (req, res) => {
  let data = req.body;
  if (req.file) {
    data.receipt_image = req.file.path;
  }
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.user.id, data);
    sendResponse(res, 200, true, 'Expense updated successfully', expense);
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.deleteExpense = catchAsync(async (req, res) => {
  try {
    await expenseService.deleteExpense(req.params.id, req.user.id);
    sendResponse(res, 200, true, 'Expense deleted successfully');
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.getExpenses = catchAsync(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.user.id, req.query);
  sendResponse(res, 200, true, 'Expenses retrieved successfully', expenses);
});

exports.getExpenseById = catchAsync(async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id, req.user.id);
    sendResponse(res, 200, true, 'Expense retrieved successfully', expense);
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.getMonthlyExpenses = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) {
    res.status(400);
    throw new Error('Month and year are required');
  }
  const expenses = await expenseService.getMonthlyExpenses(req.user.id, month, year);
  sendResponse(res, 200, true, 'Monthly expenses retrieved successfully', expenses);
});

exports.getExpensesByCategory = catchAsync(async (req, res) => {
  const expenses = await expenseService.getExpenses(req.user.id, { category: req.params.category });
  sendResponse(res, 200, true, 'Category expenses retrieved successfully', expenses);
});
