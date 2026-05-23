import type { Transaction } from "./mockDb";

export const reportService = {
  // Generates and downloads a CSV spreadsheet
  exportToExcel(transactions: Transaction[], reportName = "Transaction_Report") {
    if (transactions.length === 0) return;

    // CSV Headers
    const headers = ["ID", "Type", "Title", "Amount", "Category", "Date", "Description"];
    
    // CSV Rows
    const rows = transactions.map((t) => [
      t.id,
      t.type.toUpperCase(),
      `"${t.title.replace(/"/g, '""')}"`, // escape quotes
      t.amount,
      `"${t.category}"`,
      t.date,
      `"${(t.description || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${reportName}_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Generates a beautiful print layout styled as a PDF receipt/statement report
  exportToPDF(transactions: Transaction[], summary: { income: number; expense: number; savings: number }) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow pop-ups to print/export PDF reports.");
      return;
    }

    const dateStr = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const rowsHtml = transactions
      .map(
        (t) => `
      <tr style="border-bottom: 1px solid #e4e4e7;">
        <td style="padding: 12px 8px;">${t.date}</td>
        <td style="padding: 12px 8px;">${t.title}</td>
        <td style="padding: 12px 8px; text-transform: capitalize;">${t.category}</td>
        <td style="padding: 12px 8px; font-weight: 600; text-align: right; color: ${
          t.type === "expense" ? "#ef4444" : "#10b981"
        };">${t.type === "expense" ? "-" : "+"}₹${t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </td>
      </tr>
    `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>WalletWise Financial Statement</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #18181b; padding: 40px; margin: 0; }
            .header { display: flex; justify-between: space-between; justify-content: space-between; border-bottom: 2px solid #e4e4e7; padding-bottom: 20px; margin-bottom: 30px; }
            .brand { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .meta { text-align: right; font-size: 14px; color: #71717a; }
            .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 40px; }
            .card { border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; background-color: #fafafa; }
            .card-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #71717a; margin-bottom: 8px; }
            .card-value { font-size: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { padding: 12px 8px; border-bottom: 2px solid #e4e4e7; text-align: left; color: #71717a; font-size: 13px; text-transform: uppercase; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="brand">WalletWise Financial Statement</div>
              <div style="font-size: 14px; color: #71717a; margin-top: 5px;">Personal Wealth & Expense Breakdown</div>
            </div>
            <div class="meta">
              <div>Date Generated: ${dateStr}</div>
              <div>Report Period: Year-To-Date</div>
            </div>
          </div>

          <div class="summary-cards">
            <div class="card">
              <div class="card-title">Total Income</div>
              <div class="card-value" style="color: #10b981;">₹${summary.income.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="card">
              <div class="card-title">Total Expense</div>
              <div class="card-value" style="color: #ef4444;">₹${summary.expense.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div class="card">
              <div class="card-title">Net Savings</div>
              <div class="card-value" style="color: #4f46e5;">₹${summary.savings.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
          </div>

          <h2>Transaction History</h2>
          <table>
            <thead>
              <tr>
                <th style="width: 15%;">Date</th>
                <th style="width: 45%;">Title</th>
                <th style="width: 25%;">Category</th>
                <th style="width: 15%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  },
};

export default reportService;
