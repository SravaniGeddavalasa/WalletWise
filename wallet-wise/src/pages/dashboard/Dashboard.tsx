import React, { useEffect, useState } from "react";
import { ArrowDownRight, Wallet, TrendingUp, Target, PlusCircle, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import Button from "../../components/common/Button";
import { Link } from "react-router-dom";
import expenseService from "../../services/expenseService";
import incomeService from "../../services/incomeService";
import budgetService from "../../services/budgetService";
import type { Transaction, BudgetLimit } from "../../services/mockDb";
import { CardSkeleton, ChartSkeleton } from "../../components/common/Skeleton";
import ExpensePieChart from "../../components/charts/ExpensePieChart";
import IncomeExpenseBarChart from "../../components/charts/IncomeExpenseBarChart";
import MonthlyTrendLineGraph from "../../components/charts/MonthlyTrendLineGraph";
import CategoryAnalytics from "../../components/charts/CategoryAnalytics";
import { useToast } from "../../hooks/useToast";

export const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Totals calculations
  const [totals, setTotals] = useState({
    income: 0,
    expenses: 0,
    savings: 0,
    budgetUtilization: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expenseData, incomeData, budgetData] = await Promise.all([
          expenseService.getExpenses(),
          incomeService.getIncomes(),
          budgetService.getBudgets(),
        ]);

        const allTransactions = [...expenseData, ...incomeData].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setTransactions(allTransactions);
        setBudgets(budgetData);

        // Sum computations
        const totalInc = incomeData.reduce((sum, item) => sum + item.amount, 0);
        const totalExp = expenseData.reduce((sum, item) => sum + item.amount, 0);
        const savings = totalInc - totalExp;

        // Budget calculations
        const totalBudgetLimit = budgetData.reduce((sum, b) => sum + b.limit, 0);
        const utilization = totalBudgetLimit > 0 ? Math.round((totalExp / totalBudgetLimit) * 100) : 0;

        setTotals({
          income: totalInc,
          expenses: totalExp,
          savings,
          budgetUtilization: utilization,
        });
      } catch (err: any) {
        addToast("Error fetching dashboard statistics.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [addToast]);

  const cards = [
    {
      title: "Total Income",
      value: totals.income,
      prefix: "₹",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      description: "YTD incoming wealth streams",
    },
    {
      title: "Total Expenses",
      value: totals.expenses,
      prefix: "₹",
      icon: ArrowDownRight,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      description: "YTD outgoing wealth expenditures",
    },
    {
      title: "Net Savings",
      value: totals.savings,
      prefix: "₹",
      icon: Wallet,
      color: "text-primary",
      bg: "bg-primary/10",
      description: "Net funds available",
    },
    {
      title: "Budget Status",
      value: totals.budgetUtilization,
      suffix: "%",
      icon: Target,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      description: "Spent vs total budget limit",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-8 space-y-6 pt-20">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-md" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="flex-1 space-y-6 p-8 pt-20 select-none">
      {/* Upper header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back!</h2>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            Here's a breakdown of your current personal finances.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/expenses">
            <Button size="sm" className="h-10 text-xs px-4">
              <PlusCircle className="mr-2 h-4.5 w-4.5" />
              Add Expense
            </Button>
          </Link>
        </div>
      </div>

      {/* Numerical Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-all border-border/50 bg-background/50 backdrop-blur-md relative overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bg}`}>
                  <Icon className={`h-4.5 w-4.5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {card.prefix || ""}{card.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{card.suffix || ""}
                </div>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Charts & Feed Split */}
      <div className="grid gap-6 lg:grid-cols-6">
        {/* Cashflow side comparison bar chart */}
        <IncomeExpenseBarChart transactions={transactions} />

        {/* Recent Transactions lists card */}
        <Card className="col-span-4 lg:col-span-2 border-border/50 bg-background/50 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="text-lg">Recent Ledger</CardTitle>
            <CardDescription>Your last 5 transaction statements</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 px-6">
            {recentTransactions.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground font-medium">
                No recent transactions.
              </div>
            ) : (
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-1 hover:bg-muted/10 rounded-lg transition-colors duration-150">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9.5 h-9.5 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                        tx.type === "expense" ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
                      }`}>
                        {tx.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground leading-none mb-1.5">{tx.title}</p>
                        <p className="text-xs text-muted-foreground leading-none">{tx.date} • {tx.category}</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold flex-shrink-0 ml-2 ${
                      tx.type === "expense" ? "text-rose-500" : "text-emerald-500"
                    }`}>
                      {tx.type === "expense" ? "-" : "+"}₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lower Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-5">
        <ExpensePieChart expenses={transactions.filter((t) => t.type === "expense")} />
        <MonthlyTrendLineGraph transactions={transactions} />
      </div>

      {/* Categories limits bar chart */}
      <div className="grid gap-6">
        <CategoryAnalytics expenses={transactions.filter((t) => t.type === "expense")} budgets={budgets} />
      </div>
    </div>
  );
};

export default Dashboard;
