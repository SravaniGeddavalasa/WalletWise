import React, { useEffect, useState } from "react";
import { PlusCircle, Edit2, AlertTriangle, Target } from "lucide-react";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import EmptyState from "../../components/common/EmptyState";
import BudgetForm from "../../components/forms/BudgetForm";
import budgetService from "../../services/budgetService";
import expenseService from "../../services/expenseService";
import type { BudgetLimit, Transaction } from "../../services/mockDb";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const Budget: React.FC = () => {
  const { addToast } = useToast();
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetLimit | null>(null);

  const fetchData = async () => {
    try {
      const [budgetData, expenseData] = await Promise.all([
        budgetService.getBudgets(),
        expenseService.getExpenses(),
      ]);
      setBudgets(budgetData);
      setExpenses(expenseData);
    } catch (err: any) {
      addToast("Failed to fetch budget configurations.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (formData: any) => {
    setIsLoading(true);
    try {
      await budgetService.updateBudget(formData.category, Number(formData.limit), formData.period);
      addToast(`Budget for "${formData.category}" has been saved.`, "success");
      setIsFormOpen(false);
      setEditingBudget(null);
      fetchData();
    } catch (err: any) {
      addToast("Failed to update budget limit.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Compile budget limits combined with actual expense sums
  const budgetStatus = React.useMemo(() => {
    const expenseTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      expenseTotals[e.category] = (expenseTotals[e.category] || 0) + (e.amount || 0);
    });

    return budgets.map((b) => {
      const limit = b.limit || 0;
      const spent = expenseTotals[b.category] || 0;
      
      let percentage = 0;
      let statusColor = "bg-emerald-500";
      let statusText = "Healthy";
      let isExceeded = false;
      let displayPercentage = "No limit set";

      if (limit > 0) {
        percentage = Math.round((spent / limit) * 100);
        displayPercentage = `${percentage}% utilized`;
        
        if (spent > limit) {
          statusColor = "bg-rose-500";
          statusText = "Exceeded";
          isExceeded = true;
        } else if (percentage >= 80) {
          statusColor = "bg-amber-500";
          statusText = "Warning (80%+)";
        }
      } else {
        percentage = 0;
        displayPercentage = "No limit set";
        statusText = "Healthy";
        statusColor = "bg-emerald-500";
      }

      // Progress bar should be clamped between 0 and 100 visually
      const clampedPercentage = Math.max(0, Math.min(100, percentage));

      return {
        ...b,
        limit,
        spent,
        percentage,
        displayPercentage,
        clampedPercentage,
        statusColor,
        statusText,
        isExceeded
      };
    });
  }, [budgets, expenses]);

  // Aggregate stats
  const totalLimit = budgetStatus.reduce((sum, item) => sum + item.limit, 0);
  const totalSpent = expenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const overBudgets = budgetStatus.filter((b) => b.isExceeded);

  return (
    <div className="p-8 pt-20 space-y-6 select-none">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Budget Manager</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Control category limits and receive warning alerts</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditingBudget(null);
            setIsFormOpen(true);
          }}
          className="h-10 text-xs px-4"
        >
          <PlusCircle className="mr-2 h-4.5 w-4.5" />
          Configure Budget
        </Button>
      </div>

      {/* Overview stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 border border-border/50 bg-background/50 rounded-2xl overflow-hidden break-words">
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Total Monthly Limit</div>
          <div className="text-2xl font-bold">₹{totalLimit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="p-6 border border-border/50 bg-background/50 rounded-2xl overflow-hidden break-words">
          <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Total Budget Spent</div>
          <div className="text-2xl font-bold text-rose-500">₹{totalSpent.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="p-6 border border-border/50 bg-background/50 rounded-2xl flex items-center justify-between overflow-hidden break-words">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-2">Over-budget categories</div>
            <div className="text-2xl font-bold">{overBudgets.length} / {budgets.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <AlertTriangle className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Warnings Board if any overruns */}
      {overBudgets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm flex gap-3 items-start leading-relaxed font-semibold"
        >
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            Budget overrun warning! You have exceeded monthly spending limits on category:{" "}
            {overBudgets.map((b) => `"${b.category}"`).join(", ")}. Consider pausing non-essential purchases.
          </div>
        </motion.div>
      )}

      {/* Budget list cards grid */}
      {budgetStatus.length === 0 ? (
        <EmptyState
          title="No budgets configured"
          description="Setting budget limits helps you track spending thresholds and increase savings rates."
          icon={<Target className="h-7 w-7 text-primary" />}
          actionText="Create Limit"
          onAction={() => setIsFormOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {budgetStatus.map((b) => (
            <div
              key={b.id}
              className="p-6 rounded-2xl border border-border/50 bg-background/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-base text-foreground leading-none mb-1.5">{b.category}</h3>
                  <span className="text-xs text-muted-foreground font-semibold uppercase">{b.period}</span>
                </div>
                <button
                  onClick={() => {
                    setEditingBudget(b);
                    setIsFormOpen(true);
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors cursor-pointer"
                >
                  <Edit2 className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Numerical breakdown */}
              <div className="flex items-baseline justify-between text-sm mb-2">
                <div className="font-semibold text-foreground/80">
                  Spent: <span className="font-bold text-foreground">₹{b.spent.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="text-xs text-muted-foreground font-semibold">
                  Limit: ₹{b.limit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden mb-3 relative">
                <motion.div
                  className={cn("h-full rounded-full absolute left-0 top-0", b.statusColor)}
                  initial={{ width: 0 }}
                  animate={{ width: `${b.clampedPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              {/* Warning label */}
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-muted-foreground">{b.displayPercentage}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] uppercase font-bold",
                  b.statusText === "Exceeded" ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                  b.statusText === "Warning (80%+)" ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                  "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                )}>
                  {b.statusText}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Budget Limit Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingBudget(null);
        }}
        title={editingBudget ? `Modify "${editingBudget.category}" Limit` : "Configure Category Limit"}
      >
        <BudgetForm
          initialData={editingBudget}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};

export default Budget;
