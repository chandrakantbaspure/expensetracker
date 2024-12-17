<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title">{{ isEditing ? 'Edit Expense' : 'Add New Expense' }}</h5>
      <form @submit.prevent="handleSubmit" class="row g-3">
        <div class="col-md-6">
          <input 
            v-model="expenseData.title" 
            type="text" 
            class="form-control" 
            placeholder="Title" 
            required
          >
        </div>
        <div class="col-md-6">
          <input 
            v-model.number="expenseData.amount" 
            type="number" 
            class="form-control" 
            placeholder="Amount" 
            required
          >
        </div>
        <div class="col-md-6">
          <select 
            v-model="expenseData.category" 
            class="form-select" 
            required
          >
            <option value="">Select Category</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <input 
            v-model="expenseData.date" 
            type="date" 
            class="form-control" 
            required
          >
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            {{ isEditing ? 'Update' : 'Add' }} Expense
          </button>
          <button 
            v-if="isEditing" 
            type="button" 
            class="btn btn-secondary ms-2" 
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: 'ExpenseForm',
  props: {
    expense: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      expenseData: {
        title: '',
        amount: '',
        category: '',
        date: ''
      }
    }
  },
  computed: {
    ...mapState('expenses', ['categories']),
    isEditing() {
      return !!this.expense;
    }
  },
  watch: {
    expense(newExpense) {
      if (newExpense) {
        this.expenseData = { ...newExpense };
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.isEditing) {
          await this.$store.dispatch('expenses/updateExpense', {
            id: this.expense.id,
            expense: this.expenseData
          });
           Swal.fire('Success', 'Expense updated successfully', 'success');
        } else {
          await this.$store.dispatch('expenses/addExpense', this.expenseData);
           Swal.fire('Success', 'Expense added successfully', 'success');
        }
        this.resetForm();
        this.$emit('submitted');
      } catch (error) {
        Swal.fire('Error', error.message, 'error');
      }
    },
    cancelEdit() {
      this.resetForm();
      this.$emit('cancel-edit');
    },
    resetForm() {
      this.expenseData = {
        title: '',
        amount: '',
        category: '',
        date: ''
      };
    }
  }
}
</script>