<template>
  <div class="row">
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Monthly Summary</h5>
          <div class="chart-container" style="position: relative; height:300px;">
            <Bar :data="monthlyChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
    
    <div class="col-md-6 mb-4">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Category Breakdown</h5>
          <div class="chart-container" style="position: relative; height:300px;">
            <Pie :data="categoryChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Monthly Statistics</h5>
          <div class="row g-4">
            <div class="col-md-3">
              <div class="stat-card bg-primary text-white p-3 rounded">
                <h6>Total Expenses</h6>
                <h3>${{ totalMonthlyExpenses.toFixed(2) }}</h3>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card bg-success text-white p-3 rounded">
                <h6>Highest Category</h6>
                <h3>{{ highestCategory.category }}</h3>
                <small>${{ highestCategory.amount.toFixed(2) }}</small>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card bg-info text-white p-3 rounded">
                <h6>Average Daily</h6>
                <h3>${{ averageDailyExpense.toFixed(2) }}</h3>
              </div>
            </div>
            <div class="col-md-3">
              <div class="stat-card bg-warning text-white p-3 rounded">
                <h6>Total Transactions</h6>
                <h3>{{ monthlyExpenses.length }}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Bar, Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { mapGetters } from 'vuex';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default {
  name: 'ExpenseReports',
  components: {
    Bar,
    Pie
  },
  computed: {
    ...mapGetters('expenses', ['monthlyExpenses', 'expensesByCategory']),
    totalMonthlyExpenses() {
      return this.monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
    },
    averageDailyExpense() {
      return this.totalMonthlyExpenses / 30;
    },
    highestCategory() {
      return this.expensesByCategory.reduce((max, current) => 
        current.amount > max.amount ? current : max, 
        { category: '', amount: 0 }
      );
    },
    monthlyChartData() {
      const dailyExpenses = {};
      this.monthlyExpenses.forEach(expense => {
        const date = new Date(expense.date).getDate();
        dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.amount;
      });

      return {
        labels: Object.keys(dailyExpenses),
        datasets: [{
          label: 'Daily Expenses',
          data: Object.values(dailyExpenses),
          backgroundColor: '#36A2EB'
        }]
      };
    },
    categoryChartData() {
      return {
        labels: this.expensesByCategory.map(item => item.category),
        datasets: [{
          data: this.expensesByCategory.map(item => item.amount),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF'
          ]
        }]
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false
      };
    }
  }
};
</script>

<style scoped>
.stat-card {
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-container {
  margin-top: 1rem;
}
</style>