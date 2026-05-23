import axiosInstance from "../api/axiosInstance";
import type { BudgetLimit } from "./mockDb";

export const budgetService = {
  async getBudgets(): Promise<BudgetLimit[]> {
    const res = await axiosInstance.get("/budgets");
    return (res.data || []).map((b: any) => ({
      ...b,
      limit: Number(b.limit),
      spent: Number(b.spent || 0),
      remaining: Number(b.remaining || 0),
    }));
  },

  async updateBudget(category: string, limitVal: number, period = "monthly"): Promise<BudgetLimit> {
    const res = await axiosInstance.put("/budgets", { category, limit: limitVal, period });
    const b = res.data;
    return {
      ...b,
      limit: Number(b.limit),
      spent: Number(b.spent || 0),
      remaining: Number(b.remaining || 0),
    };
  },

  async deleteBudget(id: string): Promise<void> {
    await axiosInstance.delete(`/budgets/${id}`);
  },
};

export default budgetService;
