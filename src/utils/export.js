import { saveAs } from 'file-saver';
import { formatCurrency } from './currency';

export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    throw new Error('No data to export');
  }

  // Convert data to CSV format
  const csvContent = [
    // Headers
    Object.keys(data[0]).join(','),
    // Data rows
    ...data.map(item => 
      Object.values(item)
        .map(value => `"${value || ''}"`)
        .join(',')
    )
  ].join('\n');

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};

export const exportToPDF = async (expenses, filename) => {
  if (!expenses || !expenses.length) {
    throw new Error('No data to export');
  }

  const { jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Expense Report', 15, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 25);

  // Calculate and add summary
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  doc.text(`Total Expenses: ${formatCurrency(total)}`, 15, 35);

  // Prepare table data
  const tableData = expenses.map(expense => [
    new Date(expense.date).toLocaleDateString(),
    expense.title,
    expense.category,
    formatCurrency(expense.amount)
  ]);

  // Add table
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