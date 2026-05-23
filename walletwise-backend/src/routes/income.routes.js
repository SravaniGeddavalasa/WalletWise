const express = require('express');
const incomeController = require('../controller/income.controller');
const validate = require('../middleware/validate.middleware');
const { createIncome, updateIncome } = require('../validation/income.validation');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(isAuth);

router.post('/', validate(createIncome), incomeController.createIncome);
router.put('/:id', validate(updateIncome), incomeController.updateIncome);
router.delete('/:id', incomeController.deleteIncome);
router.get('/', incomeController.getIncomes);
router.get('/reports', incomeController.getIncomeReports);
router.get('/monthly', incomeController.getMonthlyIncomes);

module.exports = router;
