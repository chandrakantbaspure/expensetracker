import { expenseService } from '@/services/expenses';
import { showSuccess, showError } from '@/utils/notifications';

export const state = {
  expenses: [],
  filters: {
    category: '',
    dateRange: {
      start: '',
      end: ''
    },
    keyword: ''
  },
  categories: ['Food', 'Transport', 'Utilities', 'Entertainment', 'Miscellaneous'],
  loading: false,
  error: null
};

export const mutations = {
  SET_EXPENSES(state, expenses) {
    state.expenses = expenses;
  },
  ADD_EXPENSE(state, expense) {
    state.expenses.unshift(expense);
  },
  UPDATE_EXPENSE(state, updatedExpense) {
    const index = state.expenses.findIndex(e => e.id === updatedExpense.id);
    if (index !== -1) {
      state.expenses.splice(index, 1, updatedExpense);
    }
  },
  DELETE_EXPENSE(state, expenseId) {
    state.expenses = state.expenses.filter(e => e.id !== expenseId);
  },
  SET_FILTERS(state, filters) {
    state.filters = { ...state.filters, ...filters };
  },
  RESET_FILTERS(state) {
    state.filters = {
      category: '',
      dateRange: {
        start: '',
        end: ''
      },
      keyword: ''
    };
  },
  SET_LOADING(state, status) {
    state.loading = status;
  },
  SET_ERROR(state, error) {
    state.error = error;
  }
};

export const actions = {
  async fetchExpenses({ commit }) {
    commit('SET_LOADING', true);
    try {
      const username = localStorage.getItem('user');
      const expenses = await expenseService.getAllExpenses();
      commit('SET_EXPENSES', expenses);
    } catch (error) {
      commit('SET_ERROR', error.message);
      await showError('Error', 'Failed to fetch expenses');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async addExpense({ commit }, expense) {
    commit('SET_LOADING', true);
    try {
      const newExpense = await expenseService.addExpense(expense);
      commit('ADD_EXPENSE', newExpense);
      await showSuccess('Success', 'Expense added successfully');
      return newExpense;
    } catch (error) {
      commit('SET_ERROR', error.message);
      await showError('Error', 'Failed to add expense');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async updateExpense({ commit }, { id, expense }) {
    commit('SET_LOADING', true);
    try {
      const updatedExpense = await expenseService.updateExpense(id, expense);
      commit('UPDATE_EXPENSE', updatedExpense);
      showSuccess('Success', 'Expense updated successfully');
      return updatedExpense;
    } catch (error) {
      commit('SET_ERROR', error.message);
      showError('Error', 'Failed to update expense');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  async deleteExpense({ commit }, id) {
    commit('SET_LOADING', true);
    try {
      await expenseService.deleteExpense(id);
      commit('DELETE_EXPENSE', id);
      showSuccess('Success', 'Expense deleted successfully');
    } catch (error) {
      commit('SET_ERROR', error.message);
      showError('Error', 'Failed to delete expense');
      throw error;
    } finally {
      commit('SET_LOADING', false);
    }
  },

  resetFilters({ commit }) {
    commit('RESET_FILTERS');
  }
};

export const getters = {
  filteredExpenses: (state) => {
    return state.expenses.filter(expense => {
      const matchesCategory = !state.filters.category || 
                            expense.category === state.filters.category;

      const matchesKeyword = !state.filters.keyword || 
                            expense.title.toLowerCase().includes(state.filters.keyword.toLowerCase());

      const expenseDate = new Date(expense.date);
      const startDate = state.filters.dateRange.start ? new Date(state.filters.dateRange.start) : null;
      const endDate = state.filters.dateRange.end ? new Date(state.filters.dateRange.end) : null;

      const matchesDateRange = (!startDate || expenseDate >= startDate) && 
                             (!endDate || expenseDate <= endDate);

      return matchesCategory && matchesKeyword && matchesDateRange;
    });
  },
  
  totalExpenses: (state) => {
    return state.expenses.reduce((total, expense) => total + expense.amount, 0);
  },
  
  monthlyExpenses: (state) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    return state.expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear;
    });
  },
  
  expensesByCategory: (state) => {
    return state.categories.map(category => ({
      category,
      amount: state.expenses
        .filter(e => e.category === category)
        .reduce((sum, e) => sum + e.amount, 0)
    })).sort((a, b) => b.amount - a.amount);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};