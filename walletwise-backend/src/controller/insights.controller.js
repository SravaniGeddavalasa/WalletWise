const insightsService = require('../service/insights.service');
const { sendResponse } = require('../utils/response.util');
const catchAsync = require('../utils/catchAsync');

exports.getInsights = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const insights = await insightsService.getInsights(req.user.id, month, year);
  sendResponse(res, 200, true, 'Insights retrieved successfully', insights);
});
