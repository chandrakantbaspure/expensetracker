export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20
      }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#344767',
      bodyColor: '#344767',
      borderColor: '#e9ecef',
      borderWidth: 1,
      padding: 10,
      displayColors: true,
      callbacks: {
        label: function(context) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          label += new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(context.raw);
          return label;
        }
      }
    }
  }
};

export const getBarChartConfig = (labels, data, label = 'Amount') => ({
  labels,
  datasets: [{
    label,
    data,
    backgroundColor: 'rgba(54, 162, 235, 0.8)',
    borderColor: 'rgba(54, 162, 235, 1)',
    borderWidth: 1,
    borderRadius: 6,
    maxBarThickness: 50,
    hoverBackgroundColor: 'rgba(54, 162, 235, 1)'
  }]
});

export const getPieChartConfig = (labels, data) => ({
  labels,
  datasets: [{
    data,
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)'
    ],
    borderWidth: 1,
    hoverOffset: 4
  }]
});

