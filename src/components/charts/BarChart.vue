<template>
  <Bar 
    :data="chartData" 
    :options="mergedOptions" 
    v-if="isDataValid"
  />
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { defaultChartOptions } from '@/utils/chartConfig';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default {
  name: 'BarChart',
  components: { Bar },
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isDataValid() {
      return this.chartData && 
             this.chartData.labels && 
             this.chartData.labels.length > 0 &&
             this.chartData.datasets &&
             this.chartData.datasets.length > 0;
    },
    mergedOptions() {
      return {
        ...defaultChartOptions,
        ...this.options,
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
      };
    }
  }
};
</script>