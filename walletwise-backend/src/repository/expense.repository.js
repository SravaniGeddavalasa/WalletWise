const { Expense } = require('../model');
const { Op } = require('sequelize');

class ExpenseRepository {
  async create(data) {
    return await Expense.create(data);
  }

  async findById(id, userId) {
    return await Expense.findOne({ where: { id, user_id: userId } });
  }

  async update(id, userId, data) {
    const updated = await Expense.update(data, { where: { id, user_id: userId }, returning: true });
    return updated[1][0];
  }

  async delete(id, userId) {
    return await Expense.destroy({ where: { id, user_id: userId } });
  }

  async findAll(userId, filters = {}) {
    return await Expense.findAll({
      where: { user_id: userId, ...filters },
      order: [['date', 'DESC']],
    });
  }
}

module.exports = new ExpenseRepository();
