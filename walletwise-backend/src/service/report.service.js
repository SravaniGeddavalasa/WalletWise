const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');
const dashboardService = require('./dashboard.service');
const transactionService = require('./transaction.service');

class ReportService {
  async generatePDF(userId, month, year, res) {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const lastDay = new Date(y, m, 0).getDate();
    const startDate = `${y}-${m.toString().padStart(2, '0')}-01`;
    const endDate = `${y}-${m.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    const summary = await dashboardService.getSummary(userId, m, y);
    const transactions = await transactionService.getTransactions(userId, { startDate, endDate, limit: 1000 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${m}-${y}.pdf`);
    
    doc.pipe(res);

    doc.fontSize(25).text('WalletWise Monthly Report', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(16).text(`Month: ${m} / Year: ${y}`);
    doc.moveDown();

    doc.fontSize(14).text(`Total Income: $${summary.totalIncome.toFixed(2)}`);
    doc.text(`Total Expense: $${summary.totalExpense.toFixed(2)}`);
    doc.text(`Savings: $${summary.savings.toFixed(2)}`);
    doc.moveDown();

    doc.fontSize(18).text('Transactions', { underline: true });
    doc.moveDown();

    if (transactions.data && transactions.data.length > 0) {
      transactions.data.forEach(t => {
        doc.fontSize(12).text(`${t.date} - ${t.type} - ${t.title} (${t.category}): $${parseFloat(t.amount).toFixed(2)}`);
      });
    } else {
      doc.fontSize(12).text('No transactions found for this month.');
    }

    doc.end();
  }

  async generateExcel(userId, month, year, res) {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    const lastDay = new Date(y, m, 0).getDate();
    const startDate = `${y}-${m.toString().padStart(2, '0')}-01`;
    const endDate = `${y}-${m.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    const transactions = await transactionService.getTransactions(userId, { startDate, endDate, limit: 1000 });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Title', key: 'title', width: 30 },
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];

    if (transactions.data && transactions.data.length > 0) {
      transactions.data.forEach(t => {
        worksheet.addRow({
          date: t.date,
          type: t.type,
          title: t.title,
          category: t.category,
          amount: parseFloat(t.amount),
        });
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Report-${m}-${y}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  }

  async getSummary(userId, month, year) {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    return await dashboardService.getSummary(userId, m, y);
  }
}

module.exports = new ReportService();
