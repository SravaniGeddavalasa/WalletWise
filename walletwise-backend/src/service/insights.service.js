const dashboardService = require('./dashboard.service');
const budgetService = require('./budget.service');

class InsightsService {
  async getInsights(userId, month, year) {
    const summary = await dashboardService.getSummary(userId, month, year);
    const categoryReport = await dashboardService.getCategoryReport(userId, month, year);
    const budgets = await budgetService.getBudgets(userId);

    const suggestions = [];
    
    // Check savings
    if (summary.savings < 0) {
      suggestions.push("You are spending more than you earn. Consider cutting down on non-essential expenses.");
    } else if (summary.savings > 0 && summary.savings < (summary.totalIncome * 0.2)) {
      suggestions.push("You are saving less than 20% of your income. Try to increase your savings.");
    } else if (summary.savings > 0) {
      suggestions.push("Great job! You are saving a healthy amount of your income.");
    }

    // Check high spending categories
    for (const [category, amount] of Object.entries(categoryReport)) {
      if (amount > (summary.totalExpense * 0.4)) {
         suggestions.push(`You spent ${(amount/summary.totalExpense*100).toFixed(0)}% of your expenses on ${category}. Consider reducing this.`);
      }
    }

    // Calculate a simple finance score (0-100)
    let score = 50; // base score
    if (summary.totalIncome > 0) {
      const savingsRatio = summary.savings / summary.totalIncome;
      score += savingsRatio * 50; // max +50 for savings
    }
    
    // Penalty for overspending
    const overspent = budgets.filter(b => parseFloat(b.remaining) < 0).length;
    score -= overspent * 10;

    score = Math.max(0, Math.min(100, score));

    return {
      finance_score: Math.round(score),
      suggestions,
      summary
    };
  }
}

module.exports = new InsightsService();
