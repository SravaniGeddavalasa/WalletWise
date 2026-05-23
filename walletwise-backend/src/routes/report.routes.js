const express = require('express');
const reportController = require('../controller/report.controller');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(isAuth);

router.get('/pdf', reportController.generatePDF);
router.get('/excel', reportController.generateExcel);
router.get('/summary', reportController.getSummary);

module.exports = router;
