import React, { useEffect, useState } from "react";
import { PlusCircle, Search, Edit2, Trash2, Receipt } from "lucide-react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import ExpenseForm from "../../components/forms/ExpenseForm";
import ReusableTable from "../../components/tables/ReusableTable";
import type { Column } from "../../components/tables/ReusableTable";
import expenseService from "../../services/expenseService";
import budgetService from "../../services/budgetService";
import type { Transaction, BudgetLimit } from "../../services/mockDb";
import { useToast } from "../../hooks/useToast";
import { useDebounce } from "../../hooks/useDebounce";

export const Expenses: React.FC = () => {
  const { addToast } = useToast();
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Transaction | null>(null);
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      const [data, budgetData] = await Promise.all([
        expenseService.getExpenses(),
        budgetService.getBudgets(),
      ]);
      setExpenses(data);
      setBudgets(budgetData);
    } catch (err: any) {
      addToast("Failed to fetch expenses list.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddOrEditSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, formData);
        addToast("Expense record updated successfully.", "success");
      } else {
        await expenseService.addExpense(formData);
        
        // Check budget warnings
        const budgetObj = budgets.find(
          (b) => b.category.toLowerCase() === formData.category.toLowerCase()
        );
        if (budgetObj) {
          // Compute category totals
          const currentCategoryExpenses = expenses
            .filter((e) => e.category.toLowerCase() === formData.category.toLowerCase())
            .reduce((sum, item) => sum + item.amount, 0) + Number(formData.amount);
            
          const percent = (currentCategoryExpenses / budgetObj.limit) * 100;
          if (percent >= 100) {
            addToast(`⚠️ Budget alert! Category "${budgetObj.category}" budget limit has been exceeded!`, "warning", 6000);
          } else if (percent >= 80) {
            addToast(`⚠️ Warning: Category "${budgetObj.category}" has reached ${percent.toFixed(0)}% of its limit.`, "warning", 5000);
          }
        }

        addToast("New expense record added.", "success");
      }
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch (err: any) {
      addToast(err.message || "Failed to save expense data.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingExpense) return;
    setIsLoading(true);
    try {
      await expenseService.deleteExpense(deletingExpense.id);
      addToast("Expense record deleted successfully.", "success");
      setDeletingExpense(null);
      fetchExpenses();
    } catch (err: any) {
      addToast("Failed to delete record.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter & Search computation
  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (e.description || "").toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchCategory =
        selectedCategory === "All" || e.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [expenses, debouncedSearch, selectedCategory]);

  const categories = ["All", "Food & Dining", "Transport", "Shopping", "Entertainment", "Bills", "Healthcare", "Other"];

  // Table Columns Definition
  const columns: Column<Transaction>[] = [
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (val, row) => (
        <div className="flex items-center gap-2">
          {row.receiptUrl ? (
            <button
              onClick={() => setActiveReceiptUrl(row.receiptUrl || null)}
              className="text-primary hover:text-primary/80 transition-colors p-1 rounded-md bg-primary/10 cursor-pointer"
              title="View Receipt"
            >
              <Receipt className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-6 h-6 inline-flex" />
          )}
          <span className="font-semibold text-foreground/90">{val}</span>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (val) => <span className="font-bold text-rose-500">₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
      render: (val) => (
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-secondary text-secondary-foreground border">
          {val}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1.5 select-none">
          <button
            onClick={() => {
              setEditingExpense(row);
              setIsFormOpen(true);
            }}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDeletingExpense(row)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 pt-20 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Expense Manager</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Add and track your monthly spending records</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingExpense(null);
            setIsFormOpen(true);
          }}
          className="h-10 text-xs px-4"
        >
          <PlusCircle className="mr-2 h-4.5 w-4.5" />
          Record Expense
        </Button>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b pb-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-11 w-full rounded-xl border border-input bg-background/50 pl-11 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-semibold text-muted-foreground hidden sm:inline select-none">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="flex h-11 w-full sm:w-[180px] rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / Empty state block */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          title={search || selectedCategory !== "All" ? "No matches found" : "No transactions found"}
          description={
            search || selectedCategory !== "All"
              ? "Try adjusting your search query or filters."
              : "Click the button above to log your first expense transaction."
          }
          actionText={search || selectedCategory !== "All" ? undefined : "Record Expense"}
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <ReusableTable columns={columns} data={filteredExpenses} pageSize={10} />
      )}

      {/* Expense Modal (Create/Edit) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        title={editingExpense ? "Edit Expense Entry" : "Record New Expense"}
      >
        <ExpenseForm
          initialData={editingExpense}
          onSubmit={handleAddOrEditSubmit}
          isLoading={isLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deletingExpense}
        onClose={() => setDeletingExpense(null)}
        title="Confirm Deletion"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to permanently delete expense record{" "}
            <span className="font-semibold text-foreground">"{deletingExpense?.title}"</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2 select-none">
            <Button variant="outline" size="sm" onClick={() => setDeletingExpense(null)}>
              Cancel
            </Button>
            <Button variant="danger" size="sm" onClick={handleDeleteConfirm} isLoading={isLoading}>
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Image Preview Modal */}
      <Modal
        isOpen={!!activeReceiptUrl}
        onClose={() => setActiveReceiptUrl(null)}
        title="Receipt Preview"
        size="lg"
      >
        <div className="flex flex-col items-center justify-center gap-4 bg-muted/10 p-2 rounded-xl border border-border/50">
          <img src={activeReceiptUrl || ""} alt="Receipt attachment" className="max-h-[60vh] object-contain rounded-lg" />
          <Button variant="outline" size="sm" onClick={() => setActiveReceiptUrl(null)} className="h-9 px-4">
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Expenses;
