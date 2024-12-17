import {authService} from '@/services/auth';
import {showSuccess, showError} from '@/utils/notifications';
import router from '@/router';

export default {
    namespaced: true,

    state: {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        initialized: false
    },

    mutations: {
        SET_USER(state, user) {
            state.user = user;
            state.isAuthenticated = !!user;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            state.isAuthenticated = !!token;
        },
        SET_LOADING(state, status) {
            state.loading = status;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_INITIALIZED(state, status) {
            state.initialized = status;
        },
        CLEAR_AUTH(state) {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        }
    },

    actions: {
        async initAuth({commit}) {
            try {
                const token = authService.getToken();
                const user = authService.getCurrentUser();

                if (token && user) {
                    commit('SET_TOKEN', token);
                    commit('SET_USER', user);
                }
            } catch (error) {
                console.error('Error initializing auth:', error);
            } finally {
                commit('SET_INITIALIZED', true);
            }
        },

        async login({commit}, credentials) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);

            try {
                const {token, user} = await authService.login(credentials);
                commit('SET_TOKEN', token);
                commit('SET_USER', user);
                await showSuccess('Welcome back!', 'Login successful');
                await router.push('/');
            } catch (error) {
                commit('SET_ERROR', error.message);
                await showError('Login Failed', error.message);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async register({commit}, userData) {
            commit('SET_LOADING', true);
            commit('SET_ERROR', null);
            try {
                const {token, user} = await authService.register(userData);
                commit('SET_TOKEN', token);
                commit('SET_USER', user);
                await showSuccess('Welcome!', 'Registration successful');
                await router.push('/');
            } catch (error) {
                commit('SET_ERROR', error.message);
                await showError('Registration Failed', error.message);
                throw error;
            } finally {
                commit('SET_LOADING', false);
            }
        },

        async logout({commit}) {
            authService.logout();
            commit('CLEAR_AUTH');
            await router.push('/login');
            await showSuccess('Logged Out', 'You have been successfully logged out');
        }
    },

    getters: {
        isAuthenticated: state => state.isAuthenticated,
    }
};