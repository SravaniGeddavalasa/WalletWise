import React, { useEffect, useState } from "react";
import { FileSpreadsheet, FileText, Calendar, Activity } from "lucide-react";
import Button from "../../components/common/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import expenseService from "../../services/expenseService";
import incomeService from "../../services/incomeService";
import reportService from "../../services/reportService";
import type { Transaction } from "../../services/mockDb";
import { useToast } from "../../hooks/useToast";
import ReusableTable from "../../components/tables/ReusableTable";
import type { Column } from "../../components/tables/ReusableTable";

export const Reports: React.FC = () => {
  const { addToast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState("all"); // "month", "all"

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const [expenses, incomes] = await Promise.all([
          expenseService.getExpenses(),
          incomeService.getIncomes(),
        ]);
        const combined = [...expenses, ...incomes].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(combined);
      } catch (err: any) {
        addToast("Failed to compile transactions feed for reports.", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTransactions();
  }, [addToast]);

  // Compute filtered list based on selected timePeriod (e.g. past 30 days)
  const filteredList = React.useMemo(() => {
    if (timePeriod === "all") return transactions;

    const limitDate = new Date();
    limitDate.setDate(limitDate.getDate() - 30);

    return transactions.filter((t) => new Date(t.date) >= limitDate);
  }, [transactions, timePeriod]);

  // Totals calculations
  const totals = React.useMemo(() => {
    let income = 0;
    let expense = 0;

    filteredList.forEach((t) => {
      if (t.type === "income") {
        income += t.amount;
      } else {
        expense += t.amount;
      }
    });

    return {
      income,
      expense,
      savings: income - expense,
    };
  }, [filteredList]);

  const handleExport = (format: "pdf" | "excel") => {
    if (filteredList.length === 0) {
      addToast("No transactions found in this period to export.", "warning");
      return;
    }

    try {
      if (format === "excel") {
        reportService.exportToExcel(filteredList, `WalletWise_${timePeriod}_Report`);
        addToast("Excel report compiled and downloaded.", "success");
      } else {
        reportService.exportToPDF(filteredList, totals);
        addToast("PDF print statement rendered.", "success");
      }
    } catch (err) {
      addToast("Export failed. Please check permissions.", "error");
    }
  };

  const columns: Column<Transaction>[] = [
    {
      key: "date",
      header: "Date",
      sortable: true,
    },
    {
      key: "title",
      header: "Title",
      sortable: true,
      render: (val) => <span className="font-semibold text-foreground/90">{val}</span>,
    },
    {
      key: "category",
      header: "Category",
      sortable: true,
    },
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
            val === "income"
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
              : "bg-rose-500/10 text-rose-500 border border-rose-500/10"
          }`}
        >
          {val}
        </span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (val, row) => (
        <span className={`font-bold ${row.type === "expense" ? "text-rose-500" : "text-emerald-500"}`}>
          {row.type === "expense" ? "-" : "+"}₹{val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
  ];

  return (
    <div className="p-8 pt-20 space-y-6">
      {/* Header bar */}
      <div>
        <h2 className="text-2xl font-extrabold text-foreground">Financial Reports</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Export statement records as Excel sheets or PDF print bills</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Controls Column */}
        <Card className="md:col-span-1 border-border/50 bg-background/50 h-fit">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4.5 w-4.5 text-primary" />
              Configure Filter
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase select-none">Timeframe</label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-input bg-background/50 px-3.5 py-2 text-sm focus-visible:outline-none focus-visible:ring-2"
              >
                <option value="all">All-Time (YTD)</option>
                <option value="month">Past 30 Days</option>
              </select>
            </div>

            <div className="border-t border-border/40 pt-4 flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase select-none">Export Actions</label>
              <Button
                variant="outline"
                onClick={() => handleExport("excel")}
                fullWidth
                className="h-10 text-xs gap-2 select-none"
                leftIcon={<FileSpreadsheet className="h-4 w-4 text-emerald-500" />}
              >
                Export Excel (CSV)
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport("pdf")}
                fullWidth
                className="h-10 text-xs gap-2 select-none"
                leftIcon={<FileText className="h-4 w-4 text-blue-500" />}
              >
                Print / Save PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data summary preview and table */}
        <div className="md:col-span-3 space-y-6">
          {/* Summary values cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 border border-border/50 bg-background/50 rounded-2xl overflow-hidden break-words">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Period Income</span>
              <span className="text-xl font-bold text-emerald-500">₹{totals.income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="p-4 border border-border/50 bg-background/50 rounded-2xl overflow-hidden break-words">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Period Expense</span>
              <span className="text-xl font-bold text-rose-500">₹{totals.expense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="p-4 border border-border/50 bg-background/50 rounded-2xl overflow-hidden break-words">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">Period Net Savings</span>
              <span className="text-xl font-bold text-primary">₹{totals.savings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Table display */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Activity className="h-4.5 w-4.5 text-primary" />
              Previewing {filteredList.length} Transactions
            </h3>
            {isLoading ? (
              <div className="h-32 bg-muted/20 animate-pulse rounded-xl" />
            ) : (
              <ReusableTable columns={columns} data={filteredList} pageSize={8} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
