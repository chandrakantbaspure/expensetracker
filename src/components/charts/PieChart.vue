<template>
  <Pie 
    :data="chartData" 
    :options="mergedOptions"
    v-if="chartData && chartData.labels && chartData.datasets"
  />
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { defaultChartOptions } from '@/utils/chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export default {
  name: 'PieChart',
  components: { Pie },
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
    mergedOptions() {
      return {
        ...defaultChartOptions,
        ...this.options
      };
    }
  }
};
</script>