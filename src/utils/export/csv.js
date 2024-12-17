import { saveAs } from 'file-saver';

export const exportToCSV = (data, filename) => {
  if (!data || !data.length) {
    throw new Error('No data to export');
  }

  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(item =>
      Object.values(item)
        .map(value => `"${value || ''}"`)
        .join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${filename}.csv`);
};