import React from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Transaction, BudgetLimit } from "../../services/mockDb";

interface CategoryAnalyticsProps {
  expenses: Transaction[];
  budgets: BudgetLimit[];
}

export const CategoryAnalytics: React.FC<CategoryAnalyticsProps> = ({ expenses, budgets }) => {
  const { theme } = useTheme();

  // Combine expenses and budgets per category
  const chartData = React.useMemo(() => {
    // 1. Sum up expenses per category
    const expenseTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      expenseTotals[e.category] = (expenseTotals[e.category] || 0) + e.amount;
    });

    // 2. Map budgets and add expenses, default budget to 0 if none set
    const categoriesList = new Set([...Object.keys(expenseTotals), ...budgets.map((b) => b.category)]);

    return Array.from(categoriesList).map((cat) => {
      const budgetObj = budgets.find((b) => b.category.toLowerCase() === cat.toLowerCase());
      const limit = budgetObj ? budgetObj.limit : 0;
      const spent = expenseTotals[cat] || 0;

      return {
        category: cat,
        Limit: Number(limit.toFixed(2)),
        Spent: Number(spent.toFixed(2)),
      };
    });
  }, [expenses, budgets]);

  const colors = {
    spent: theme === "dark" ? "#f43f5e" : "#e11d48",       // Rose / Red-ish
    limit: theme === "dark" ? "#3f3f46" : "#d4d4d8",       // Muted Grey / Secondary
    text: theme === "dark" ? "#a1a1aa" : "#71717a",
    grid: theme === "dark" ? "#27272a" : "#f4f4f5",
    cardBg: theme === "dark" ? "#18181b" : "#ffffff",
  };

  return (
    <Card className="col-span-4 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Category Budget Analytics</CardTitle>
        <CardDescription>Compare actual category spending against set monthly limits</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <div className="h-[320px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={colors.grid} />
              <XAxis
                type="number"
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
              />
              <YAxis
                dataKey="category"
                type="category"
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colors.grid}`,
                  background: colors.cardBg,
                  color: "var(--color-foreground)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar
                name="Budget Limit"
                dataKey="Limit"
                fill={colors.limit}
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
              <Bar
                name="Actual Spent"
                dataKey="Spent"
                fill={colors.spent}
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryAnalytics;
