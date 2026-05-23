const incomeRepository = require('../repository/income.repository');
const { Op } = require('sequelize');

class IncomeService {
  async createIncome(userId, data) {
    return await incomeRepository.create({ ...data, user_id: userId });
  }

  async updateIncome(id, userId, data) {
    const income = await incomeRepository.findById(id, userId);
    if (!income) throw new Error('Income not found');
    return await incomeRepository.update(id, userId, data);
  }

  async deleteIncome(id, userId) {
    const income = await incomeRepository.findById(id, userId);
    if (!income) throw new Error('Income not found');
    await incomeRepository.delete(id, userId);
  }

  async getIncomes(userId, query) {
    const filters = {};
    if (query.category) filters.category = query.category;
    return await incomeRepository.findAll(userId, filters);
  }

  async getIncomeReports(userId) {
    const incomes = await incomeRepository.findAll(userId);
    const report = incomes.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
      return acc;
    }, {});
    return report;
  }

  async getMonthlyIncomes(userId, month, year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return await incomeRepository.findAll(userId, {
      date: {
        [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
      }
    });
  }
}

module.exports = new IncomeService();
