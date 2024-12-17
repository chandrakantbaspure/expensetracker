<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <div class="container-fluid py-4">
        <!-- Header -->
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 mb-0">Reports & Analytics</h1>
            <p class="text-muted mb-0">View and analyze your expense data</p>
          </div>
          <div class="btn-group">
            <button 
              @click="exportData('csv')" 
              class="btn btn-outline-primary"
              :disabled="!filteredExpenses.length"
            >
              <i class="bi bi-file-earmark-spreadsheet me-2"></i>
              Export CSV
            </button>
            <button 
              @click="exportData('pdf')" 
              class="btn btn-outline-primary"
              :disabled="!filteredExpenses.length"
            >
              <i class="bi bi-file-earmark-pdf me-2"></i>
              Export PDF
            </button>
          </div>
        </div>

        <!-- Filters -->
        <div class="card mb-4">
          <div class="card-body">
            <ExpenseFilters @update:filters="handleFiltersUpdate" />
          </div>
        </div>

        <!-- Summary Cards -->
        <div class="row g-4 mb-4">
          <div class="col-md-3">
            <div class="stat-card bg-gradient-primary text-white">
              <div class="stat-icon">
                <i class="bi bi-cash-stack"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ formatCurrency(totalAmount) }}</h3>
                <p class="stat-label mb-0">Total Expenses</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-success text-white">
              <div class="stat-icon">
                <i class="bi bi-graph-up"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ formatCurrency(averageAmount) }}</h3>
                <p class="stat-label mb-0">Average per Transaction</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-info text-white">
              <div class="stat-icon">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ highestCategory.category || 'N/A' }}</h3>
                <p class="stat-label mb-0">Highest Spending Category</p>
              </div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="stat-card bg-gradient-warning text-white">
              <div class="stat-icon">
                <i class="bi bi-receipt"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-value">{{ filteredExpenses.length }}</h3>
                <p class="stat-label mb-0">Total Transactions</p>
              </div>
            </div>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-md-8">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">Expense Trend</h5>
                <div class="chart-container">
                  <BarChart 
                    :chartData="trendChartData"
                    v-if="trendChartData.labels?.length > 0"
                  />
                  <div 
                    v-else 
                    class="d-flex align-items-center justify-content-center h-100 text-muted"
                  >
                    No data available for the selected period
                  </div>
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
                  <div 
                    v-else 
                    class="d-flex align-items-center justify-content-center h-100 text-muted"
                  >
                    No data available
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Table -->
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Detailed Report</h5>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="expense in filteredExpenses" :key="expense.id">
                    <td>{{ formatDate(expense.date) }}</td>
                    <td>{{ expense.title }}</td>
                    <td>
                      <span 
                        class="badge" 
                        :class="getCategoryBadgeClass(expense.category)"
                      >
                        {{ expense.category }}
                      </span>
                    </td>
                    <td>{{ formatCurrency(expense.amount) }}</td>
                  </tr>
                  <tr v-if="!filteredExpenses.length">
                    <td colspan="4" class="text-center text-muted py-4">
                      No expenses found for the selected filters
                    </td>
                  </tr>
                </tbody>
                <tfoot v-if="filteredExpenses.length">
                  <tr class="fw-bold">
                    <td colspan="3">Total</td>
                    <td>{{ formatCurrency(totalAmount) }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Sidebar from '@/components/layout/Sidebar.vue';
import ExpenseFilters from '@/components/expense/ExpenseFilters.vue';
import BarChart from '@/components/charts/BarChart.vue';
import PieChart from '@/components/charts/PieChart.vue';
import { formatCurrency } from '@/utils/currency';
import { formatDate } from '@/utils/date';
import { getCategoryBadgeClass } from '@/utils/categories';
import { getBarChartConfig, getPieChartConfig } from '@/utils/chartConfig';
import { exportToCSV, exportToPDF } from '@/utils/export';
import Swal from 'sweetalert2';

export default {
  name: 'Reports',
  components: {
    Sidebar,
    ExpenseFilters,
    BarChart,
    PieChart
  },
  computed: {
    ...mapState('expenses', ['expenses', 'categories']),
    ...mapGetters('expenses', ['filteredExpenses']),
    
    totalAmount() {
      return this.filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    },
    
    averageAmount() {
      return this.filteredExpenses.length ? 
        this.totalAmount / this.filteredExpenses.length : 0;
    },
    
    highestCategory() {
      const categoryTotals = this.categories.map(category => ({
        category,
        amount: this.filteredExpenses
          .filter(e => e.category === category)
          .reduce((sum, e) => sum + e.amount, 0)
      }));
      
      return categoryTotals.reduce((max, current) => 
        current.amount > max.amount ? current : max, 
        { category: '', amount: 0 }
      );
    },
    
    trendChartData() {
      const dailyTotals = {};
      this.filteredExpenses
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .forEach(expense => {
          const date = formatDate(expense.date);
          dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
        });

      return getBarChartConfig(
        Object.keys(dailyTotals),
        Object.values(dailyTotals),
        'Daily Expenses'
      );
    },
    
    categoryChartData() {
      const categoryTotals = {};
      this.filteredExpenses.forEach(expense => {
        categoryTotals[expense.category] = 
          (categoryTotals[expense.category] || 0) + expense.amount;
      });

      return getPieChartConfig(
        Object.keys(categoryTotals),
        Object.values(categoryTotals)
      );
    }
  },
  methods: {
    formatCurrency,
    formatDate,
    getCategoryBadgeClass,
    handleFiltersUpdate(filters) {
      this.$store.commit('expenses/SET_FILTERS', filters);
    },
    async exportData(type) {
      try {
        if (type === 'csv') {
          const data = this.filteredExpenses.map(expense => ({
            Date: formatDate(expense.date),
            Title: expense.title,
            Category: expense.category,
            Amount: formatCurrency(expense.amount)
          }));
          exportToCSV(data, 'expense-report');
        } else if (type === 'pdf') {
          await exportToPDF(this.filteredExpenses, 'expense-report');
        }
        
        Swal.fire({
          icon: 'success',
          title: 'Export Successful',
          text: `Your report has been exported as ${type.toUpperCase()}`,
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Export Failed',
          text: error.message
        });
      }
    }
  },
  mounted() {
    if (!this.expenses.length) {
      this.$store.dispatch('expenses/fetchExpenses');
    }
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

.chart-container {
  position: relative;
  height: 300px;
  margin-top: 1rem;
}

.card {
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}

.badge {
  padding: 0.5em 1em;
  font-weight: 500;
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
</style>