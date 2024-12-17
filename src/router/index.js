
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Dashboard = () => import('../views/Dashboard.vue');
const Login = () => import('../views/Login.vue');
const Register = () => import('../views/Register.vue');
const ExpenseList = () => import('../views/expenses/ExpenseList.vue');
const ExpenseForm = () => import('../views/expenses/ExpenseForm.vue');
const Reports = () => import('../views/Reports.vue');

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/expenses',
    name: 'ExpenseList',
    component: ExpenseList,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/new',
    name: 'AddExpense',
    component: ExpenseForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/expenses/:id/edit',
    name: 'EditExpense',
    component: ExpenseForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  if (!store.state.auth.initialized) {
    await store.dispatch('auth/initAuth');
  }

  const isAuthenticated = store.getters['auth/isAuthenticated'];

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Dashboard' });
    return;
  }

  next();
});

export default router;
