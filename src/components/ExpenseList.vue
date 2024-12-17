<template>
  <div class="card">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h5 class="card-title">Expenses List</h5>
        <div class="filters">
          <input 
            v-model="filters.keyword" 
            type="text" 
            class="form-control d-inline-block w-auto me-2" 
            placeholder="Search expenses..."
          >
          <select 
            v-model="filters.category" 
            class="form-select d-inline-block w-auto me-2"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
          <input 
            v-model="filters.dateRange.start" 
            type="date" 
            class="form-control d-inline-block w-auto me-2"
          >
          <input 
            v-model="filters.dateRange.end" 
            type="date" 
            class="form-control d-inline-block w-auto"
          >
        </div>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="expense in filteredExpenses" :key="expense.id">
              <td>{{ expense.title }}</td>
              <td>${{ expense.amount.toFixed(2) }}</td>
              <td>
                <span class="badge" :class="getCategoryBadgeClass(expense.category)">
                  {{ expense.category }}
                </span>
              </td>
              <td>{{ formatDate(expense.date) }}</td>
              <td>
                <button 
                  @click="editExpense(expense)" 
                  class="btn btn-sm btn-primary me-2"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button 
                  @click="confirmDelete(expense.id)" 
                  class="btn btn-sm btn-danger"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: 'ExpenseList',
  data() {
    return {
      filters: {
        keyword: '',
        category: '',
        dateRange: {
          start: '',
          end: ''
        }
      }
    }
  },
  computed: {
    ...mapState('expenses', ['categories']),
    ...mapGetters('expenses', ['filteredExpenses'])
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    getCategoryBadgeClass(category) {
      const classes = {
        'Food': 'bg-success',
        'Transport': 'bg-info',
        'Utilities': 'bg-warning',
        'Entertainment': 'bg-primary',
        'Miscellaneous': 'bg-secondary'
      };
      return classes[category] || 'bg-secondary';
    },
    editExpense(expense) {
      this.$emit('edit', expense);
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
          await this.$store.dispatch('expenses/deleteExpense', id);
          Swal.fire('Deleted!', 'Expense has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error', error.message, 'error');
        }
      }
    }
  },
  watch: {
    filters: {
      deep: true,
      handler(newFilters) {
        this.$store.commit('expenses/SET_FILTERS', newFilters);
      }
    }
  }
}
</script>

<style scoped>
.badge {
  padding: 0.5em 1em;
}
</style>