const express = require('express');
const dashboardController = require('../controller/dashboard.controller');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(isAuth);

router.get('/summary', dashboardController.getSummary);
router.get('/category-report', dashboardController.getCategoryReport);
router.get('/recent-transactions', dashboardController.getRecentTransactions);

module.exports = router;
