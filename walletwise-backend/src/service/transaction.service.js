const expenseService = require('./expense.service');
const incomeService = require('./income.service');
const { Op } = require('sequelize');

class TransactionService {
  async getTransactions(userId, query) {
    let expenses = await expenseService.getExpenses(userId, {});
    let incomes = await incomeService.getIncomes(userId, {});

    let allTransactions = [
      ...expenses.map(e => ({ type: 'EXPENSE', id: e.id, date: e.date, amount: e.amount, category: e.category, title: e.title, description: e.description, note: e.description })),
      ...incomes.map(i => ({ type: 'INCOME', id: i.id, date: i.date, amount: i.amount, category: i.category, title: i.title, description: i.description, note: i.description }))
    ];

    if (query.startDate && query.endDate) {
      allTransactions = allTransactions.filter(t => t.date >= query.startDate && t.date <= query.endDate);
    }

    if (query.type) {
      allTransactions = allTransactions.filter(t => t.type === query.type.toUpperCase());
    }

    if (query.search) {
      const searchLower = query.search.toLowerCase();
      allTransactions = allTransactions.filter(t => 
        t.title.toLowerCase().includes(searchLower) || 
        t.category.toLowerCase().includes(searchLower)
      );
    }

    if (query.sort === 'amount_asc') {
      allTransactions.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else if (query.sort === 'amount_desc') {
      allTransactions.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    } else if (query.sort === 'date_asc') {
      allTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = allTransactions.slice(startIndex, endIndex);

    return {
      total: allTransactions.length,
      page,
      limit,
      totalPages: Math.ceil(allTransactions.length / limit),
      data: results
    };
  }
}

module.exports = new TransactionService();
