const expenseRepository = require('../repository/expense.repository');
const budgetService = require('./budget.service');
const { Op } = require('sequelize');

class ExpenseService {
  async createExpense(userId, data) {
    const expense = await expenseRepository.create({ ...data, user_id: userId });
    await budgetService.updateBudgetSpending(userId, data.category, data.amount, data.date);
    return expense;
  }

  async updateExpense(id, userId, data) {
    const expense = await expenseRepository.findById(id, userId);
    if (!expense) throw new Error('Expense not found');
    return await expenseRepository.update(id, userId, data);
  }

  async deleteExpense(id, userId) {
    const expense = await expenseRepository.findById(id, userId);
    if (!expense) throw new Error('Expense not found');
    await expenseRepository.delete(id, userId);
  }

  async getExpenses(userId, query) {
    const filters = {};
    if (query.category) filters.category = query.category;
    if (query.amount) filters.amount = query.amount;
    
    if (query.startDate && query.endDate) {
      filters.date = {
        [Op.between]: [query.startDate, query.endDate]
      };
    } else if (query.date) {
      filters.date = query.date;
    }

    return await expenseRepository.findAll(userId, filters);
  }

  async getExpenseById(id, userId) {
    const expense = await expenseRepository.findById(id, userId);
    if (!expense) throw new Error('Expense not found');
    return expense;
  }

  async getMonthlyExpenses(userId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0); // Last day of month

    return await expenseRepository.findAll(userId, {
      date: {
        [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      }
    });
  }
}

module.exports = new ExpenseService();
