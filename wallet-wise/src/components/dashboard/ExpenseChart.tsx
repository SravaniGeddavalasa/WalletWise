import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useTheme } from "../theme-provider";

const data = [
  { day: "Mon", expenses: 120, savings: 30, budget: 150 },
  { day: "Tue", expenses: 85, savings: 65, budget: 150 },
  { day: "Wed", expenses: 190, savings: 0, budget: 150 },
  { day: "Thu", expenses: 45, savings: 105, budget: 150 },
  { day: "Fri", expenses: 210, savings: 0, budget: 150 },
  { day: "Sat", expenses: 320, savings: 0, budget: 200 },
  { day: "Sun", expenses: 150, savings: 50, budget: 200 },
];

export const ExpenseChart = () => {
  const { theme } = useTheme();
  
  // Dynamic colors based on theme
  const colors = {
    expenses: theme === "dark" ? "#6366f1" : "#4f46e5", // Primary
    savings: theme === "dark" ? "#10b981" : "#059669",  // Emerald
    budget: theme === "dark" ? "#27272a" : "#e4e4e7",   // Muted
    text: theme === "dark" ? "#a1a1aa" : "#71717a",     // Muted Foreground
    grid: theme === "dark" ? "#27272a" : "#f4f4f5",     // Border/Secondary
  };

  return (
    <Card className="col-span-4 lg:col-span-4 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Daily Budget Analysis</CardTitle>
        <CardDescription>Daily expenses vs savings against your budget limits</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 pb-4">
        <div className="h-[380px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={colors.grid} />
              <XAxis
                dataKey="day"
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
                  borderRadius: '12px', 
                  border: `1px solid ${colors.grid}`, 
                  background: 'var(--color-card)',
                  color: 'var(--color-foreground)',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ fontWeight: 500 }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              
              <Bar
                name="Expenses"
                dataKey="expenses"
                fill={colors.expenses}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              />
              <Bar
                name="Savings"
                dataKey="savings"
                fill={colors.savings}
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
                animationBegin={200}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
