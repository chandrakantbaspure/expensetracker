<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <i class="bi bi-wallet2 auth-icon"></i>
          <h2>Welcome Back</h2>
          <p class="text-muted">Login to manage your expenses</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="auth-form" novalidate>
          <div class="form-group mb-3">
            <label class="form-label d-flex align-items-center">
              <i class="bi bi-person me-2"></i>
              Username
            </label>
            <input 
              v-model="credentials.username"
              :class="{'is-invalid': errors.username}"
              type="text" 
              class="form-control" 
              placeholder="Enter your username"
              @input="validateField('username')"
              required
            >
            <div class="invalid-feedback" v-if="errors.username">
              {{ errors.username }}
            </div>
          </div>

          <div class="form-group mb-4">
            <label class="form-label d-flex align-items-center">
              <i class="bi bi-lock me-2"></i>
              Password
            </label>
            <div class="password-input">
              <input 
                v-model="credentials.password"
                :type="showPassword ? 'text' : 'password'"
                :class="{'is-invalid': errors.password}"
                class="form-control" 
                placeholder="Enter your password"
                @input="validateField('password')"
                required
              >
              <button 
                type="button" 
                class="btn btn-link password-toggle"
                @click="togglePassword"
              >
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
            <div class="invalid-feedback" v-if="errors.password">
              {{ errors.password }}
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary w-100"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="text-center mt-4">
            <router-link to="/register" class="register-link">
              <i class="bi bi-person-plus me-2"></i>
              Don't have an account? Register
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Login',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      errors: {
        username: '',
        password: ''
      },
      showPassword: false,
      loading: false
    };
  },
  computed: {
    ...mapState('auth', ['isAuthenticated']),
    redirect() {
      return this.$route.query.redirect || '/';
    }
  },
  methods: {
    ...mapActions('auth', ['login']),
    validateField(field) {
      this.errors[field] = '';
      
      if (field === 'username' && !this.credentials.username) {
        this.errors.username = 'Username is required';
      }
      
      if (field === 'password' && !this.credentials.password) {
        this.errors.password = 'Password is required';
      }
    },
    validateForm() {
      this.validateField('username');
      this.validateField('password');
      return !this.errors.username && !this.errors.password;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
      if (!this.validateForm()) return;
      
      this.loading = true;
      try {
        await this.login(this.credentials);
        this.$router.replace(this.redirect);
      } catch (error) {
      } finally {
        this.loading = false;
      }
    }
  },
  created() {
    if (this.isAuthenticated) {
      this.$router.replace('/');
    }
  }
};
</script>

<style scoped>
</style>