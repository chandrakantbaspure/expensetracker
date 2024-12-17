import { formatCurrency } from '../currency';

export const exportToPDF = async (expenses, filename) => {
  if (!expenses || !expenses.length) {
    throw new Error('No data to export');
  }

  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text('Expense Report', 15, 15);

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.text(`Total Expenses: ${formatCurrency(total)}`, 15, 35);

  const tableData = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.title,
    expense.category,
    formatCurrency(expense.amount)
  ]);

  autoTable(doc, {
    head: [['Date', 'Title', 'Category', 'Amount']],
    body: tableData,
    startY: 45,
    theme: 'grid',
    styles: { 
      fontSize: 8,
      cellPadding: 2
    },
    headStyles: { 
      fillColor: [54, 162, 235],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    }
  });

  doc.save(`${filename}.pdf`);
};