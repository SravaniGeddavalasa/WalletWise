const expenseService = require('./expense.service');
const incomeService = require('./income.service');

class DashboardService {
  async getSummary(userId, month, year) {
    const expenses = await expenseService.getMonthlyExpenses(userId, month, year);
    const incomes = await incomeService.getMonthlyIncomes(userId, month, year);

    const totalExpense = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const savings = totalIncome - totalExpense;

    return {
      totalExpense,
      totalIncome,
      savings,
    };
  }

  async getCategoryReport(userId, month, year) {
    const expenses = await expenseService.getMonthlyExpenses(userId, month, year);
    const report = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    return report;
  }

  async getRecentTransactions(userId) {
    const expenses = await expenseService.getExpenses(userId, {});
    const incomes = await incomeService.getIncomes(userId, {});

    const allTransactions = [
      ...expenses.map(e => ({ type: 'EXPENSE', date: e.date, amount: e.amount, category: e.category, title: e.title })),
      ...incomes.map(i => ({ type: 'INCOME', date: i.date, amount: i.amount, category: i.category, title: i.title }))
    ];

    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    return allTransactions.slice(0, 10);
  }
}

module.exports = new DashboardService();
