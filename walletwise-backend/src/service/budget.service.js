const budgetRepository = require('../repository/budget.repository');

class BudgetService {
  async createBudget(userId, data) {
    const existing = await budgetRepository.findAll(userId, { 
      category: data.category, 
      month: data.month, 
      year: data.year 
    });
    if (existing.length > 0) {
      throw new Error('Budget for this category in the specified month already exists');
    }
    
    data.remaining = data.limit;
    data.spent = 0;
    return await budgetRepository.create({ ...data, user_id: userId });
  }

  async updateBudget(id, userId, data) {
    const budget = await budgetRepository.findById(id, userId);
    if (!budget) throw new Error('Budget not found');
    
    if (data.limit !== undefined) {
      data.remaining = parseFloat(data.limit) - parseFloat(budget.spent);
    }
    
    return await budgetRepository.update(id, userId, data);
  }

  async getBudgets(userId) {
    return await budgetRepository.findAll(userId);
  }

  async updateBudgetSpending(userId, category, amount, date) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    const budgets = await budgetRepository.findAll(userId, { category, month, year });
    if (budgets.length > 0) {
      const budget = budgets[0];
      const newSpent = parseFloat(budget.spent) + parseFloat(amount);
      const newRemaining = parseFloat(budget.limit) - newSpent;

      await budgetRepository.update(budget.id, userId, {
        spent: newSpent,
        remaining: newRemaining
      });
    }
  }

  async getRemainingBudgets(userId, month, year) {
    return await budgetRepository.findAll(userId, { month, year });
  }

  async getBudgetWarnings(userId, month, year) {
    const budgets = await budgetRepository.findAll(userId, { month, year });
    const warnings = [];

    budgets.forEach(b => {
      const spentPercentage = (parseFloat(b.spent) / parseFloat(b.limit)) * 100;
      if (spentPercentage >= b.warning_percentage) {
        warnings.push({
          category: b.category,
          spent_percentage: spentPercentage,
          message: `Warning: You have used ${spentPercentage.toFixed(2)}% of your ${b.category} budget.`
        });
      }
    });

    return warnings;
  }

  async getOverspending(userId, month, year) {
    const budgets = await budgetRepository.findAll(userId, { month, year });
    const overspent = [];

    budgets.forEach(b => {
      if (parseFloat(b.remaining) < 0) {
        overspent.push({
          category: b.category,
          overspent_amount: Math.abs(parseFloat(b.remaining)),
          message: `You have overspent your ${b.category} budget by ${Math.abs(parseFloat(b.remaining))}.`
        });
      }
    });

    return overspent;
  }

  async upsertBudget(userId, data) {
    const existing = await budgetRepository.findAll(userId, { 
      category: data.category, 
      month: data.month, 
      year: data.year 
    });
    if (existing.length > 0) {
      const budget = existing[0];
      const limit = parseFloat(data.limit);
      const spent = parseFloat(budget.spent);
      const remaining = limit - spent;
      return await budgetRepository.update(budget.id, userId, {
        limit,
        remaining,
        warning_percentage: data.warning_percentage !== undefined ? data.warning_percentage : budget.warning_percentage,
        period: data.period !== undefined ? data.period : budget.period
      });
    } else {
      const limit = parseFloat(data.limit);
      const remaining = limit;
      const spent = 0;
      return await budgetRepository.create({
        ...data,
        spent,
        remaining,
        user_id: userId
      });
    }
  }
}

module.exports = new BudgetService();
