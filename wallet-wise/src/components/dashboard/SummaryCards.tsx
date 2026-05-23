import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Wallet, TrendingUp, Lightbulb, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

const cards = [
  {
    title: "Monthly Spending",
    value: 2845.00,
    prefix: "₹",
    change: "+4.5%",
    trend: "up",
    icon: Wallet,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Budget Progress",
    value: 65,
    prefix: "",
    suffix: "%",
    change: "-2.1%",
    trend: "down",
    icon: Target,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "AI Insights",
    value: 4,
    prefix: "",
    suffix: " New",
    change: "+1",
    trend: "up",
    icon: Lightbulb,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Smart Spending Analysis",
    value: 8450.00,
    prefix: "₹",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
];

// Simple counter component for animated values
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = value / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  // Use Indian Number formatting
  const formattedString = count.toLocaleString('en-IN', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  });

  return <span>{prefix}{formattedString}{suffix}</span>;
};

export const SummaryCards = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className="hover:shadow-lg transition-shadow border-border/50 bg-background/60 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {card.title}
              </CardTitle>
              <motion.div 
                className={cn("p-2 rounded-full", card.bg)}
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <card.icon className={cn("h-4 w-4", card.color)} />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-2xl font-bold">
                <AnimatedCounter value={card.value} prefix={card.prefix} suffix={card.suffix} />
              </div>
              <p className="text-xs mt-1 flex items-center">
                <span
                  className={cn(
                    "flex items-center font-medium",
                    card.trend === "up" ? "text-emerald-500" : "text-rose-500"
                  )}
                >
                  {card.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {card.change}
                </span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
