<template>
  <div class="app-layout">
    <Sidebar/>
    <main class="main-content">
      <div class="container-fluid py-4">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card">
              <div class="card-body">
                <h2 class="card-title mb-4">
                  {{ isEditing ? 'Edit Expense' : 'Add New Expense' }}
                </h2>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-3">
                    <label class="form-label">Title</label>
                    <input
                        v-model="expenseData.title"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.title }"
                        placeholder="Enter expense title"
                        required
                    >
                    <div class="invalid-feedback">{{ errors.title }}</div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Amount</label>
                    <div class="input-group">
                      <span class="input-group-text">$</span>
                      <input
                          v-model.number="expenseData.amount"
                          type="number"
                          step="0.01"
                          class="form-control"
                          :class="{ 'is-invalid': errors.amount }"
                          placeholder="0.00"
                          required
                      >
                      <div class="invalid-feedback">{{ errors.amount }}</div>
                    </div>
                  </div>

                  <div class="mb-3">
                    <label class="form-label">Category</label>
                    <select
                        v-model="expenseData.category"
                        class="form-select"
                        :class="{ 'is-invalid': errors.category }"
                        required
                    >
                      <option value="">Select a category</option>
                      <option
                          v-for="category in categories"
                          :key="category"
                          :value="category"
                      >
                        {{ category }}
                      </option>
                    </select>
                    <div class="invalid-feedback">{{ errors.category }}</div>
                  </div>

                  <div class="mb-4">
                    <label class="form-label">Date</label>
                    <input
                        v-model="expenseData.date"
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': errors.date }"
                        required
                    >
                    <div class="invalid-feedback">{{ errors.date }}</div>
                  </div>

                  <div class="d-flex gap-2">
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      {{ isEditing ? 'Update Expense' : 'Add Expense' }}
                    </button>
                    <router-link to="/expenses" class="btn btn-outline-secondary">
                      Cancel
                    </router-link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex';
import Sidebar from '@/components/layout/Sidebar.vue';
import Swal from 'sweetalert2';

export default {
  name: 'ExpenseForm',
  components: {
    Sidebar
  },
  data() {
    return {
      expenseData: {
        title: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        userName: ''
      },
      errors: {
        title: '',
        amount: '',
        category: '',
        date: '',
        userName: ''
      },
      loading: false
    };
  },
  computed: {
    ...mapState('expenses', ['categories']),
    isEditing() {
      return !!this.$route.params.id;
    }
  },
  methods: {
    ...mapActions('expenses', ['addExpense', 'updateExpense']),
    validateForm() {
      let isValid = true;
      this.errors = {
        title: '',
        amount: '',
        category: '',
        date: ''
      };

      if (!this.expenseData.title) {
        this.errors.title = 'Title is required';
        isValid = false;
      }

      if (!this.expenseData.amount || this.expenseData.amount <= 0) {
        this.errors.amount = 'Please enter a valid amount';
        isValid = false;
      }

      if (!this.expenseData.category) {
        this.errors.category = 'Please select a category';
        isValid = false;
      }

      if (!this.expenseData.date) {
        this.errors.date = 'Date is required';
        isValid = false;
      }

      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        if (this.isEditing) {
          await this.updateExpense({
            id: this.$route.params.id,
            expense: this.expenseData
          });
          await Swal.fire('Success', 'Expense updated successfully', 'success');
        } else {
          this.expenseData.userName = localStorage.getItem('expense_tracker_user');

          console.log("Test: " + this.expenseData.userName);
          await this.addExpense(this.expenseData);
          await Swal.fire('Success', 'Expense added successfully', 'success');
        }
        this.$router.push('/expenses');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    if (this.isEditing) {
      const expense = this.$store.state.expenses.expenses
          .find(e => e.id === parseInt(this.$route.params.id));
      if (expense) {
        this.expenseData = {...expense};
      } else {
        this.$router.push('/expenses');
      }
    }
  },
  dateFormatted(date) {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  },

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

.card-title {
  color: #344767;
  font-weight: 600;
}
</style>