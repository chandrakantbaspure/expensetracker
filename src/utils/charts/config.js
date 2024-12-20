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