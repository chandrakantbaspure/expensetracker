import { defaultChartOptions } from './config';

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

export const getBarChartOptions = (customOptions = {}) => ({
  ...defaultChartOptions,
  ...customOptions,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return '$' + value.toFixed(2);
        }
      }
    }
  }
});