import { AlertTriangle, TrendingDown, Lightbulb, TrendingUp, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const insights = [
  {
    title: "High Spending Alert",
    description: "You've spent 80% of your Food budget this month. Consider cooking at home to save ~₹150.",
    icon: AlertTriangle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    title: "Smart Saving Suggestion",
    description: "Moving ₹500 to a high-yield savings account now could earn you ₹25 this year.",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Monthly Financial Performance",
    description: "Great job! Your utility bills are 15% lower than the past 3 months average.",
    icon: TrendingDown,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Spending Trends",
    description: "Weekend spending increased by 20%. Watch out for impulse purchases on Saturdays.",
    icon: TrendingUp,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Personalized Recommendation",
    description: "Cancel your unused streaming service to save ₹14.99/month.",
    icon: Zap,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

export const SmartInsights = () => {
  return (
    <Card className="col-span-4 lg:col-span-3 border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>AI Insights</CardTitle>
        </div>
        <CardDescription className="text-primary/80 font-medium">
          Smart spending analysis powered by machine learning
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {insights.map((insight, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              whileHover={{ scale: 1.01, backgroundColor: "var(--color-muted)" }}
              className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-colors cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className={cn("p-2.5 rounded-full h-fit flex-shrink-0 relative z-10", insight.bg)}>
                <insight.icon className={cn("h-5 w-5", insight.color)} />
              </div>
              <div className="relative z-10">
                <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{insight.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
