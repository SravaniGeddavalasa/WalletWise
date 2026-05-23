const express = require('express');
const insightsController = require('../controller/insights.controller');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(isAuth);

router.get('/', insightsController.getInsights);

module.exports = router;
