const express = require('express');
const budgetController = require('../controller/budget.controller');
const validate = require('../middleware/validate.middleware');
const { createBudget, updateBudget } = require('../validation/budget.validation');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(isAuth);

router.post('/', validate(createBudget), budgetController.createBudget);
router.put('/', validate(createBudget), budgetController.upsertBudget);
router.put('/:id', validate(updateBudget), budgetController.updateBudget);
router.get('/', budgetController.getBudgets);
router.get('/remaining', budgetController.getRemainingBudgets);
router.get('/warnings', budgetController.getBudgetWarnings);
router.get('/overspending', budgetController.getOverspending);

module.exports = router;
