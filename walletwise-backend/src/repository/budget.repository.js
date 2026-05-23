const { Budget } = require('../model');

class BudgetRepository {
  async create(data) {
    return await Budget.create(data);
  }

  async findById(id, userId) {
    return await Budget.findOne({ where: { id, user_id: userId } });
  }

  async update(id, userId, data) {
    const updated = await Budget.update(data, { where: { id, user_id: userId }, returning: true });
    return updated[1][0];
  }

  async findAll(userId, filters = {}) {
    return await Budget.findAll({ where: { user_id: userId, ...filters } });
  }
}

module.exports = new BudgetRepository();
