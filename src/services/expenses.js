import api from '@/utils/api';

export const expenseService = {
    async getAllExpenses() {
        try {
            const username = localStorage.getItem('expense_tracker_user');
            const response = await api.get('/expenses/all/' + username);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to fetch expenses');
        }
    },

    async addExpense(expense) {
        try {
            const response = await api.post('/expenses', expense);
            console.log(response);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to add expense');
        }
    },

    async updateExpense(id, expense) {
        try {
            const response = await api.put(`/expenses/${id}`, expense);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to update expense');
        }
    },

    async deleteExpense(id) {
        try {
            await api.delete(`/expenses/${id}`);
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to delete expense');
        }
    }
};