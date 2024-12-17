<template>
  <div class="sidebar bg-dark text-white">
    <div class="sidebar-header p-3">
      <h3 class="mb-0">
        <i class="bi bi-wallet2 me-2"></i>
        Expense Tracker
      </h3>
    </div>
    <div class="sidebar-menu">
      <router-link to="/" class="menu-item" active-class="active">
        <i class="bi bi-speedometer2 me-2"></i>
        Dashboard
      </router-link>
      <router-link to="/expenses" class="menu-item" active-class="active">
        <i class="bi bi-list-ul me-2"></i>
        Expenses
      </router-link>
      <router-link to="/expenses/new" class="menu-item" active-class="active">
        <i class="bi bi-plus-circle me-2"></i>
        Add Expense
      </router-link>
      <router-link to="/reports" class="menu-item" active-class="active">
        <i class="bi bi-graph-up me-2"></i>
        Reports
      </router-link>
    </div>
    <div class="sidebar-footer p-3">
      <button @click="handleLogout" class="btn btn-outline-light w-100">
        <i class="bi bi-box-arrow-right me-2"></i>
        Logout
      </button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Sidebar',
  computed: {
    ...mapState('auth', ['currentUser'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-menu {
  flex: 1;
  padding: 1rem 0;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
}

.menu-item:hover, .menu-item.active {
  color: white;
  background: rgba(255, 255, 255, 0.1);
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>