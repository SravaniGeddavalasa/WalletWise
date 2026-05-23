import axiosInstance from "../api/axiosInstance";
import type { Transaction } from "./mockDb";

export const expenseService = {
  async getExpenses(): Promise<Transaction[]> {
    const res = await axiosInstance.get("/expenses");
    return (res.data || []).map((e: any) => ({
      ...e,
      type: "expense",
      amount: Number(e.amount),
    }));
  },

  async addExpense(expenseData: Omit<Transaction, "id" | "type"> & { receipt?: File }): Promise<Transaction> {
    let payload: any = { ...expenseData };
    
    if (expenseData.receipt) {
      const base64Receipt = await convertFileToBase64(expenseData.receipt);
      payload.receiptUrl = base64Receipt;
    }
    
    delete payload.receipt;

    const res = await axiosInstance.post("/expenses", payload);
    return {
      ...res.data,
      type: "expense",
      amount: Number(res.data.amount),
    };
  },

  async updateExpense(id: string, expenseData: Partial<Transaction> & { receipt?: File }): Promise<Transaction> {
    let payload: any = { ...expenseData };
    if (expenseData.receipt) {
      const base64Receipt = await convertFileToBase64(expenseData.receipt);
      payload.receiptUrl = base64Receipt;
    }
    delete payload.receipt;

    const res = await axiosInstance.patch(`/expenses/${id}`, payload);
    return {
      ...res.data,
      type: "expense",
      amount: Number(res.data.amount),
    };
  },

  async deleteExpense(id: string): Promise<void> {
    await axiosInstance.delete(`/expenses/${id}`);
  },
};

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default expenseService;
