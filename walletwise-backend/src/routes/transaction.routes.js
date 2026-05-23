const express = require('express');
const transactionController = require('../controller/transaction.controller');
const { isAuth } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(isAuth);

router.get('/', transactionController.getTransactions);
router.get('/search', transactionController.getTransactions);
router.get('/filter', transactionController.getTransactions);

module.exports = router;
