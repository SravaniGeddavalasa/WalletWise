// Client-side local storage mock database for offline fallback and prototyping.

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string; // base64 representation
  role?: string;
  age?: number;
  gender?: string;
}

export interface Transaction {
  id: string;
  type: "expense" | "income";
  title: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
  receiptUrl?: string; // base64 representation
}

export interface BudgetLimit {
  id: string;
  category: string;
  limit: number;
  period: string; // e.g. "monthly"
}

// Initialize default data
const DEFAULT_USER: UserProfile = {
  id: "u1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Innovation Drive, San Francisco, CA 94105",
  avatar: "",
  role: "user",
};

const DEFAULT_TRANSACTIONS: Transaction[] = [];

const DEFAULT_BUDGETS: BudgetLimit[] = [];

class MockDb {
  constructor() {
    this.init();
  }

  private init() {
    // Clear any preloaded localStorage mock transaction and budget data
    localStorage.removeItem("ww_transactions");
    localStorage.removeItem("ww_budgets");

    if (!localStorage.getItem("ww_user_profile")) {
      localStorage.setItem("ww_user_profile", JSON.stringify(DEFAULT_USER));
    }
    localStorage.setItem("ww_transactions", JSON.stringify(DEFAULT_TRANSACTIONS));
    localStorage.setItem("ww_budgets", JSON.stringify(DEFAULT_BUDGETS));
    if (!localStorage.getItem("ww_users_db")) {
      // Credentials db for registration/login mocks
      localStorage.setItem("ww_users_db", JSON.stringify([{ email: DEFAULT_USER.email, password: "Password123!", profile: DEFAULT_USER }]));
    }
  }

  // User auth operations
  getUserProfile(): UserProfile {
    return JSON.parse(localStorage.getItem("ww_user_profile") || "{}");
  }

  updateUserProfile(profile: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem("ww_user_profile", JSON.stringify(updated));
    
    // Update credentials database list too
    const db = JSON.parse(localStorage.getItem("ww_users_db") || "[]");
    const idx = db.findIndex((u: any) => u.email === current.email);
    if (idx !== -1) {
      db[idx].profile = updated;
      db[idx].email = updated.email; // in case email was changed
      localStorage.setItem("ww_users_db", JSON.stringify(db));
    }
    return updated;
  }

  // Transactions CRUD
  getTransactions(): Transaction[] {
    return JSON.parse(localStorage.getItem("ww_transactions") || "[]");
  }

  saveTransactions(txs: Transaction[]) {
    localStorage.setItem("ww_transactions", JSON.stringify(txs));
  }

  addTransaction(tx: Omit<Transaction, "id">): Transaction {
    const list = this.getTransactions();
    const newTx: Transaction = {
      ...tx,
      id: "t_" + Math.random().toString(36).substr(2, 9),
    };
    list.unshift(newTx); // Add to beginning of list
    this.saveTransactions(list);
    return newTx;
  }

  updateTransaction(id: string, updatedTx: Partial<Transaction>): Transaction {
    const list = this.getTransactions();
    const idx = list.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Transaction not found");
    
    const newTx = { ...list[idx], ...updatedTx };
    list[idx] = newTx;
    this.saveTransactions(list);
    return newTx;
  }

  deleteTransaction(id: string) {
    const list = this.getTransactions();
    const filtered = list.filter((t) => t.id !== id);
    this.saveTransactions(filtered);
  }

  // Budgets CRUD
  getBudgets(): BudgetLimit[] {
    return JSON.parse(localStorage.getItem("ww_budgets") || "[]");
  }

  saveBudgets(budgets: BudgetLimit[]) {
    localStorage.setItem("ww_budgets", JSON.stringify(budgets));
  }

  updateBudget(category: string, limitVal: number, period: string = "monthly"): BudgetLimit {
    const list = this.getBudgets();
    const idx = list.findIndex((b) => b.category.toLowerCase() === category.toLowerCase());
    
    if (idx !== -1) {
      list[idx].limit = limitVal;
      list[idx].period = period;
      this.saveBudgets(list);
      return list[idx];
    } else {
      const newBudget: BudgetLimit = {
        id: "b_" + Math.random().toString(36).substr(2, 9),
        category,
        limit: limitVal,
        period,
      };
      list.push(newBudget);
      this.saveBudgets(list);
      return newBudget;
    }
  }

  deleteBudget(id: string) {
    const list = this.getBudgets();
    const filtered = list.filter((b) => b.id !== id);
    this.saveBudgets(filtered);
  }
}

export const mockDb = new MockDb();
export default mockDb;
