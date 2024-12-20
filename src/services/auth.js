import api from '@/utils/api';
import {storage} from '@/utils/storage';

export const authService = {
    async login(credentials) {
        try {
            const response = await api.post('/auth/login', credentials);
            const {username, password} = response.data;
            const token = btoa(`${username}:${password}`);
            storage.set('token', token);
            storage.set('user', username);
            const user = username;

            return {token, user};
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    },

    async register(userData) {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    },

    logout() {
        storage.remove('token');
        storage.remove('user');
    },

    getToken() {
        return storage.get('token');
    },

    getCurrentUser() {
        return storage.get('user');
    },
    getUser() {
       return localStorage.getItem('expense_tracker_user');
    }
};