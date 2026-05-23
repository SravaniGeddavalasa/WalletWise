const express = require('express');
const expenseController = require('../controller/expense.controller');
const validate = require('../middleware/validate.middleware');
const { createExpense, updateExpense } = require('../validation/expense.validation');
const { isAuth } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

router.use(isAuth);

router.post('/', upload.single('receiptImage'), validate(createExpense), expenseController.createExpense);
router.put('/:id', upload.single('receiptImage'), validate(updateExpense), expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);
router.get('/', expenseController.getExpenses);
router.get('/filter', expenseController.getExpenses); // filter by category, amount, date via query params
router.get('/monthly', expenseController.getMonthlyExpenses);
router.get('/category/:category', expenseController.getExpensesByCategory);
router.get('/:id', expenseController.getExpenseById);

module.exports = router;
