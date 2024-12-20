import { defaultChartOptions } from './config';

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

export const getPieChartOptions = (customOptions = {}) => ({
  ...defaultChartOptions,
  ...customOptions
});