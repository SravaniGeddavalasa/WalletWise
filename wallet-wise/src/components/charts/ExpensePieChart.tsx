import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useTheme } from "../theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Transaction } from "../../services/mockDb";

interface ExpensePieChartProps {
  expenses: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#f97316", // Orange
  "Transport": "#3b82f6",     // Blue
  "Shopping": "#ec4899",      // Pink
  "Entertainment": "#a855f7", // Purple
  "Bills": "#6366f1",         // Indigo
  "Healthcare": "#10b981",    // Emerald
  "Other": "#6b7280",         // Gray
};

export const ExpensePieChart = ({ expenses }: ExpensePieChartProps) => {
  const { theme } = useTheme();

  // Aggregate expenses by category
  const chartData = useMemo(() => {
    const categories: Record<string, number> = {};
    expenses.forEach((t) => {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    });

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2)),
    }));
  }, [expenses]);

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  // Format label inside chart
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 185;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.08 ? (
      <text x={x} y={y} fill="white" className="text-xs font-bold" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const colors = {
    grid: theme === "dark" ? "#27272a" : "#f4f4f5",
    cardBg: theme === "dark" ? "#18181b" : "#ffffff",
  };

  if (chartData.length === 0) {
    return (
      <Card className="col-span-4 lg:col-span-2 border-border/50 bg-background/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle>Expense Distribution</CardTitle>
          <CardDescription>Breakdown by spending category</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] flex items-center justify-center text-muted-foreground font-medium text-sm">
          No expenses recorded yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-4 lg:col-span-2 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Breakdown by spending category</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="h-[260px] w-full mt-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={95}
                innerRadius={45}
                dataKey="value"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [`₹${value.toLocaleString()}`, "Total Spent"]}
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colors.grid}`,
                  background: colors.cardBg,
                  color: "var(--color-foreground)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Legends with amounts */}
        <div className="w-full mt-4 grid grid-cols-2 gap-2 text-xs">
          {chartData.map((item) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = CATEGORY_COLORS[item.name] || "#6b7280";
            return (
              <div key={item.name} className="flex items-center gap-2 px-1">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold block truncate text-foreground/90 leading-none mb-0.5">{item.name}</span>
                  <span className="text-muted-foreground leading-none">{percentage}% (₹{item.value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
