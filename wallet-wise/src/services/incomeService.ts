import axiosInstance from "../api/axiosInstance";
import type { Transaction } from "./mockDb";

export const incomeService = {
  async getIncomes(): Promise<Transaction[]> {
    const res = await axiosInstance.get("/income");
    return (res.data || []).map((i: any) => ({
      ...i,
      type: "income",
      amount: Number(i.amount),
    }));
  },

  async addIncome(incomeData: Omit<Transaction, "id" | "type">): Promise<Transaction> {
    const res = await axiosInstance.post("/income", incomeData);
    return {
      ...res.data,
      type: "income",
      amount: Number(res.data.amount),
    };
  },

  async updateIncome(id: string, incomeData: Partial<Transaction>): Promise<Transaction> {
    const res = await axiosInstance.patch(`/income/${id}`, incomeData);
    return {
      ...res.data,
      type: "income",
      amount: Number(res.data.amount),
    };
  },

  async deleteIncome(id: string): Promise<void> {
    await axiosInstance.delete(`/income/${id}`);
  },
};

export default incomeService;
