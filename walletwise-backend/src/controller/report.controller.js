const reportService = require('../service/report.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.generatePDF = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) throw new Error("Month and year are required");
  await reportService.generatePDF(req.user.id, month, year, res);
});

exports.generateExcel = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) throw new Error("Month and year are required");
  await reportService.generateExcel(req.user.id, month, year, res);
});

exports.getSummary = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  if (!month || !year) throw new Error("Month and year are required");
  const summary = await reportService.getSummary(req.user.id, month, year);
  sendResponse(res, 200, true, 'Report summary retrieved successfully', summary);
});
