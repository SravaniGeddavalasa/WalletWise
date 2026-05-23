import { Coffee, Bus, ShoppingBag, Film, FileText, HeartPulse, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const categories = [
  { name: "Food & Dining", spent: 450, total: 600, icon: Coffee, color: "bg-orange-500", iconColor: "text-orange-500", iconBg: "bg-orange-500/10" },
  { name: "Transport", spent: 180, total: 300, icon: Bus, color: "bg-blue-500", iconColor: "text-blue-500", iconBg: "bg-blue-500/10" },
  { name: "Shopping", spent: 320, total: 400, icon: ShoppingBag, color: "bg-pink-500", iconColor: "text-pink-500", iconBg: "bg-pink-500/10" },
  { name: "Entertainment", spent: 150, total: 200, icon: Film, color: "bg-purple-500", iconColor: "text-purple-500", iconBg: "bg-purple-500/10" },
  { name: "Bills", spent: 1200, total: 1500, icon: FileText, color: "bg-indigo-500", iconColor: "text-indigo-500", iconBg: "bg-indigo-500/10" },
  { name: "Healthcare", spent: 80, total: 150, icon: HeartPulse, color: "bg-emerald-500", iconColor: "text-emerald-500", iconBg: "bg-emerald-500/10" },
  { name: "Other", spent: 45, total: 100, icon: MoreHorizontal, color: "bg-gray-500", iconColor: "text-gray-500", iconBg: "bg-gray-500/10" },
];

export const BudgetProgress = () => {
  return (
    <Card className="col-span-4 lg:col-span-2 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>Monthly spending across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((cat, i) => {
            const percentage = Math.min(100, Math.round((cat.spent / cat.total) * 100));
            return (
              <motion.div 
                key={cat.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="group"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn("p-1.5 rounded-md", cat.iconBg)}>
                      <cat.icon className={cn("h-3.5 w-3.5", cat.iconColor)} />
                    </div>
                    <span className="font-medium group-hover:text-primary transition-colors">{cat.name}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">₹{cat.spent}</span>
                    <span className="text-xs text-muted-foreground">{percentage}% of ${cat.total}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden relative">
                  <motion.div
                    className={cn("h-full rounded-full absolute left-0 top-0", cat.color)}
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
