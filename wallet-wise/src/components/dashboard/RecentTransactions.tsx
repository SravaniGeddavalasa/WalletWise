import { ShoppingBag, Coffee, Home, Zap, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

const transactions = [
  {
    id: "1",
    amount: "-₹120.00",
    date: "Today, 2:30 PM",
    title: "Grocery Shopping",
    category: "Food",
    icon: ShoppingBag,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    id: "2",
    amount: "-₹4.50",
    date: "Today, 9:00 AM",
    title: "Starbucks Coffee",
    category: "Food",
    icon: Coffee,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    id: "3",
    amount: "-₹1,200.00",
    date: "Yesterday",
    title: "Monthly Rent",
    category: "Housing",
    icon: Home,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    id: "4",
    amount: "-₹85.00",
    date: "Yesterday",
    title: "Electric Bill",
    category: "Utilities",
    icon: Zap,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    id: "5",
    amount: "-₹45.00",
    date: "Oct 24",
    title: "Uber Ride",
    category: "Transport",
    icon: Car,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
];

export const RecentTransactions = () => {
  return (
    <Card className="col-span-4 lg:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-full", transaction.bg)}>
                  <transaction.icon className={cn("h-4 w-4", transaction.color)} />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{transaction.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{transaction.date}</p>
                </div>
              </div>
              <div className="font-medium text-sm">{transaction.amount}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
