const budgetService = require('../service/budget.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.createBudget = catchAsync(async (req, res) => {
  try {
    const budget = await budgetService.createBudget(req.user.id, req.body);
    sendResponse(res, 201, true, 'Budget created successfully', budget);
  } catch (err) {
    res.status(400);
    throw err;
  }
});

exports.updateBudget = catchAsync(async (req, res) => {
  try {
    const budget = await budgetService.updateBudget(req.params.id, req.user.id, req.body);
    sendResponse(res, 200, true, 'Budget updated successfully', budget);
  } catch (err) {
    res.status(404);
    throw err;
  }
});

exports.getBudgets = catchAsync(async (req, res) => {
  const budgets = await budgetService.getBudgets(req.user.id);
  sendResponse(res, 200, true, 'Budgets retrieved successfully', budgets);
});

exports.getRemainingBudgets = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const budgets = await budgetService.getRemainingBudgets(req.user.id, month, year);
  sendResponse(res, 200, true, 'Remaining budgets retrieved successfully', budgets);
});

exports.getBudgetWarnings = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const warnings = await budgetService.getBudgetWarnings(req.user.id, month, year);
  sendResponse(res, 200, true, 'Budget warnings retrieved successfully', warnings);
});

exports.getOverspending = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const overspending = await budgetService.getOverspending(req.user.id, month, year);
  sendResponse(res, 200, true, 'Overspending data retrieved successfully', overspending);
});

exports.upsertBudget = catchAsync(async (req, res) => {
  try {
    const budget = await budgetService.upsertBudget(req.user.id, req.body);
    sendResponse(res, 200, true, 'Budget saved successfully', budget);
  } catch (err) {
    res.status(400);
    throw err;
  }
});
