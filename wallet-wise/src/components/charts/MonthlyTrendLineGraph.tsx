import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { useTheme } from "../theme-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import type { Transaction } from "../../services/mockDb";

interface MonthlyTrendLineGraphProps {
  transactions: Transaction[];
}

export const MonthlyTrendLineGraph = ({ transactions }: MonthlyTrendLineGraphProps) => {
  const { theme } = useTheme();

  // Aggregate monthly savings over the past 6 months
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { month: string; sortKey: string; savings: number }> = {};
    
    // Get past 6 months boundaries
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const name = d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
      monthlyData[key] = { month: name, sortKey: key, savings: 0 };
    }

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      const key = `${tDate.getFullYear()}-${String(tDate.getMonth() + 1).padStart(2, "0")}`;
      
      if (monthlyData[key]) {
        if (t.type === "income") {
          monthlyData[key].savings += t.amount;
        } else {
          monthlyData[key].savings -= t.amount;
        }
      }
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ month, savings }) => ({
        month,
        Savings: Number(savings.toFixed(2)),
      }));
  }, [transactions]);

  const colors = {
    line: theme === "dark" ? "#6366f1" : "#4f46e5", // Primary / Indigo
    text: theme === "dark" ? "#a1a1aa" : "#71717a",
    grid: theme === "dark" ? "#27272a" : "#f4f4f5",
    cardBg: theme === "dark" ? "#18181b" : "#ffffff",
  };

  return (
    <Card className="col-span-4 lg:col-span-3 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Net Savings Trend</CardTitle>
        <CardDescription>Monthly savings pattern (Income minus Expenses)</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <div className="h-[320px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                contentStyle={{
                  borderRadius: "12px",
                  border: `1px solid ${colors.grid}`,
                  background: colors.cardBg,
                  color: "var(--color-foreground)",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                name="Net Savings"
                type="monotone"
                dataKey="Savings"
                stroke={colors.line}
                strokeWidth={3}
                activeDot={{ r: 6 }}
                dot={{ strokeWidth: 2, r: 4 }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendLineGraph;
