const { Income } = require('../model');

class IncomeRepository {
  async create(data) {
    return await Income.create(data);
  }

  async findById(id, userId) {
    return await Income.findOne({ where: { id, user_id: userId } });
  }

  async update(id, userId, data) {
    const updated = await Income.update(data, { where: { id, user_id: userId }, returning: true });
    return updated[1][0];
  }

  async delete(id, userId) {
    return await Income.destroy({ where: { id, user_id: userId } });
  }

  async findAll(userId, filters = {}) {
    return await Income.findAll({
      where: { user_id: userId, ...filters },
      order: [['date', 'DESC']],
    });
  }
}

module.exports = new IncomeRepository();
