<template>
  <div class="app-layout">
    <Sidebar/>
    <main class="main-content">
      <div class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Dashboard</h1>
            <p class=" mb-0 user-color">Welcome back, {{ getUser }}</p>
          </div>
          <router-link to="/expenses/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>
            Add New Expense
          </router-link>
        </div>

        <!-- Stats Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card bg-gradient-primary text-white">
              <div class="stat-icon">
                <i class="bi bi-wallet2"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ formatCurrency(totalExpenses) }}</h3>
                <p class="stat-label mb-0">Total Expenses</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-success text-white">
              <div class="stat-icon">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ formatCurrency(monthlyTotal) }}</h3>
                <p class="stat-label mb-0">Monthly Expenses</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-info text-white">
              <div class="stat-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ formatCurrency(averageDailyExpense) }}</h3>
                <p class="stat-label mb-0">Daily Average</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-warning text-white">
              <div class="stat-icon">
                <i class="bi bi-receipt"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ expenses.length }}</h3>
                <p class="stat-label mb-0">Total Transactions</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-8">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Monthly Expense Trend</h5>
                <div class="chart-container">
                  <BarChart
                      :chartData="monthlyChartData"
                      v-if="monthlyChartData.labels?.length > 0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-4">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Category Distribution</h5>
                <div class="chart-container">
                  <PieChart
                      :chartData="categoryChartData"
                      v-if="categoryChartData.labels?.length > 0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <h5 class="card-title d-flex justify-content-between align-items-center">
              <span>Recent Transactions</span>
              <router-link to="/expenses" class="btn btn-sm btn-outline-primary">
                View All
              </router-link>
            </h5>
            <div class="table-responsive">
              <table class="table align-middle">
                <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="expense in recentExpenses" :key="expense.id">
                  <td>{{ formatDate(expense.date) }}</td>
                  <td>{{ expense.title }}</td>
                  <td>
                      <span class="badge" :class="getCategoryBadgeClass(expense.category)">
                        {{ expense.category }}
                      </span>
                  </td>
                  <td>{{ formatCurrency(expense.amount) }}</td>
                  <td>
                    <div class="btn-group">
                      <router-link
                          :to="`/expenses/${expense.id}/edit`"
                          class="btn btn-sm btn-outline-primary"
                      >
                        <i class="bi bi-pencil"></i>
                      </router-link>
                      <button
                          @click="deleteExpense(expense.id)"
                          class="btn btn-sm btn-outline-danger"
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex';
import Sidebar from '@/components/layout/Sidebar.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import {formatCurrency} from '@/utils/currency';
import {formatDate} from '@/utils/date';
import {getCategoryBadgeClass} from '@/utils/categories';
import {getBarChartConfig, getPieChartConfig} from '@/utils/chartConfig';

export default {
  name: 'Dashboard',
  components: {
    Sidebar,
    BarChart,
    PieChart
  },
  data() {
    return {
      getUser: ''
    }
  },
  computed: {
    ...mapState('auth', ['currentUser']),
    ...mapState('expenses', ['expenses']),
    ...mapGetters('expenses', [
      'filteredExpenses',
      'totalExpenses',
      'monthlyExpenses',
      'expensesByCategory'
    ]),
    monthlyTotal() {
      return this.monthlyExpenses.reduce((total, exp) => total + exp.amount, 0);
    },
    averageDailyExpense() {
      return this.monthlyTotal / 30;
    },
    recentExpenses() {
      return [...this.expenses]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
    },
    monthlyChartData() {
      const dailyExpenses = {};
      this.monthlyExpenses.forEach(expense => {
        const date = new Date(expense.date).toLocaleDateString();
        dailyExpenses[date] = (dailyExpenses[date] || 0) + expense.amount;
      });

      return getBarChartConfig(
          Object.keys(dailyExpenses),
          Object.values(dailyExpenses),
          'Daily Expenses'
      );
    },
    categoryChartData() {
      const categoryData = this.expensesByCategory;
      return getPieChartConfig(
          categoryData.map(item => item.category),
          categoryData.map(item => item.amount)
      );
    }
  },
  methods: {
    ...mapActions('expenses', ['fetchExpenses', 'deleteExpense']),
    formatCurrency,
    formatDate,
    getCategoryBadgeClass
  },
  mounted() {
    this.fetchExpenses();
    this.getUser = localStorage.getItem('expense_tracker_user')
  }
};
</script>

<style scoped>
.main-content {
  margin-left: 250px;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}

.bg-gradient-primary {
  background: linear-gradient(45deg, #4e73df, #224abe);
}

.bg-gradient-success {
  background: linear-gradient(45deg, #1cc88a, #13855c);
}

.bg-gradient-info {
  background: linear-gradient(45deg, #36b9cc, #258391);
}

.bg-gradient-warning {
  background: linear-gradient(45deg, #f6c23e, #dda20a);
}

.card {
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.chart-container {
  position: relative;
  height: 300px;
  margin-top: 1rem;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
}

.table th {
  font-weight: 600;
  color: #344767;
}

.btn-group .btn {
  padding: 0.25rem 0.5rem;
}

.btn-group .btn i {
  font-size: 0.875rem;
}

.user-color {
  color: black;
}
</style>