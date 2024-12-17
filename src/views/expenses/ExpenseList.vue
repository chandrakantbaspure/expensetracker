<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <div class="container-fluid py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 mb-0">Expenses</h1>
          <router-link to="/expenses/new" class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>
            Add New Expense
          </router-link>
        </div>

        <div class="card">
          <div class="card-body">
            <ExpenseFilters @update:filters="handleFiltersUpdate" />
            
            <div class="table-responsive mt-4">
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
                  <tr v-for="expense in filteredExpenses" :key="expense.id">
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
                          @click="confirmDelete(expense.id)" 
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
import { mapGetters, mapActions } from 'vuex';
import Sidebar from '@/components/layout/Sidebar.vue';
import ExpenseFilters from '@/components/expense/ExpenseFilters.vue';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';
import { getCategoryBadgeClass } from '@/utils/categories';
import Swal from 'sweetalert2';

export default {
  name: 'ExpenseList',
  components: {
    Sidebar,
    ExpenseFilters
  },
  computed: {
    ...mapGetters('expenses', ['filteredExpenses'])
  },
  methods: {
    ...mapActions('expenses', ['fetchExpenses', 'deleteExpense']),
    formatDate,
    formatCurrency,
    getCategoryBadgeClass,
    handleFiltersUpdate(filters) {
      this.$store.commit('expenses/SET_FILTERS', filters);
    },
    async confirmDelete(id) {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      });

      if (result.isConfirmed) {
        try {
          await this.deleteExpense(id);
          Swal.fire('Deleted!', 'Expense has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  },
  mounted() {
    this.fetchExpenses();
  }
};
</script>

<style scoped>
.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.card {
  border: none;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
</style>