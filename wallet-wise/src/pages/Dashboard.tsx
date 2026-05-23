import { SummaryCards } from "../components/dashboard/SummaryCards";
import { ExpenseChart } from "../components/dashboard/ExpenseChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { BudgetProgress } from "../components/dashboard/BudgetProgress";
import { SmartInsights } from "../components/dashboard/SmartInsights";
import { Button } from "../components/ui/button";
import { PlusCircle, Download } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex-1 space-y-4 p-8 pt-24">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>
      
      <SummaryCards />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <ExpenseChart />
        <RecentTransactions />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <BudgetProgress />
        <SmartInsights />
      </div>
    </div>
  );
};

export default Dashboard;
