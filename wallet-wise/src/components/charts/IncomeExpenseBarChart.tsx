import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Transaction } from "../../services/mockDb";

interface IncomeExpenseBarChartProps {
  transactions: Transaction[];
}

export const IncomeExpenseBarChart = ({ transactions }: IncomeExpenseBarChartProps) => {
  const { theme } = useTheme();

  // Aggregate past 6 months of transactions
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; sortKey: string; income: number; expenses: number }> = {};
    
    // Get past 6 months boundaries
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const name = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      monthlyData[key] = { month: name, sortKey: key, income: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      const key = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, "0")}`;
      
      if (monthlyData[key]) {
        if (t.type === "income") {
          monthlyData[key].income += t.amount;
        } else {
          monthlyData[key].expenses += t.amount;
        }
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ month, income, expenses }) => ({
        month,
        Income: Number(income.toFixed(2)),
        Expenses: Number(expenses.toFixed(2)),
      }));
  }, [transactions]);

  const colors = {
    income: theme === "dark" ? "#10b981" : "#059669",      // Emerald
    expenses: theme === "dark" ? "#6366f1" : "#4f46e5",    // Primary / Indigo
    text: theme === "dark" ? "#a1a1aa" : "#71717a",
    grid: theme === "dark" ? "#27272a" : "#f4f4f5",
    cardBg: theme === "dark" ? "#18181b" : "#ffffff",
  };

  return (
    <Card className="col-span-4 lg:col-span-4 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Cash Flow Summary</CardTitle>
        <CardDescription>Monthly comparison of income vs expenses</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <div className="h-[320px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis
                dataKey="month"
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke={colors.text}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value}`}
                dx={-10}
              />
              <Tooltip
                cursor={{ fill: colors.grid, opacity: 0.4 }}
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colors.grid}`,
                  background: colors.cardBg,
                  color: "var(--color-foreground)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Bar
                name="Income"
                dataKey="Income"
                fill={colors.income}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
              <Bar
                name="Expenses"
                dataKey="Expenses"
                fill={colors.expenses}
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseBarChart;
