<template>
  <div class="auth-container">
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <i class="bi bi-person-plus-fill auth-icon"></i>
          <h2>Create Account</h2>
          <p class="text-muted">Join us to manage your expenses</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form" novalidate>
          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-person"></i>
              Username
            </label>
            <input
                v-model="userData.username"
                :class="{'is-invalid': errors.username}"
                type="text"
                class="form-control"
                placeholder="Choose a username"
                @input="validateField('username')"
                required
            >
            <div class="invalid-feedback" v-if="errors.username">
              {{ errors.username }}
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">
              <i class="bi bi-lock"></i>
              Password
            </label>
            <div class="password-input">
              <input
                  v-model="userData.password"
                  :type="showPassword ? 'text' : 'password'"
                  :class="{'is-invalid': errors.password}"
                  class="form-control"
                  placeholder="Create a password"
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
              class="btn btn-primary w-100 mt-4"
              :disabled="isLoading"
          >
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            {{ isLoading ? 'Creating account...' : 'Register' }}
          </button>

          <div class="text-center mt-4">
            <router-link to="/login" class="login-link">
              <i class="bi bi-box-arrow-in-right"></i>
              Already have an account? Login
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import Swal from 'sweetalert2';

export default {
  name: 'Register',
  data() {
    return {
      userData: {
        username: '',
        password: ''
      },
      errors: {
        username: '',
        password: ''
      },
      showPassword: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    validateField(field) {
      this.errors[field] = '';

      if (field === 'username') {
        if (!this.userData.username) {
          this.errors.username = 'Username is required';
        } else if (this.userData.username.length < 3) {
          this.errors.username = 'Username must be at least 3 characters';
        }
      }
      if (field === 'password') {
        if (!this.userData.password) {
          this.errors.password = 'Password is required';
        } else if (this.userData.password.length < 6) {
          this.errors.password = 'Password must be at least 6 characters';
        }
      }
    },
    validateForm() {
      this.validateField('username');
      this.validateField('password');
      return !this.errors.username && !this.errors.email && !this.errors.password;
    },
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    async handleRegister() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      try {
        await this.register(this.userData);
        await Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'Please login with your credentials',
          confirmButtonColor: '#3085d6'
        });
        this.$router.push('/login');
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: error.message,
          confirmButtonColor: '#3085d6'
        });
      } finally {
        this.isLoading = false;
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-wrapper {
  width: 100%;
  max-width: 400px;
  perspective: 1000px;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  transform-style: preserve-3d;
  animation: cardEnter 0.5s ease-out;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
}

.auth-form {
  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      color: #4a5568;

      i {
        color: #667eea;
      }
    }
  }
}

.password-input {
  position: relative;

  .password-toggle {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #667eea;
    padding: 0.5rem;

    &:hover {
      color: #764ba2;
    }
  }
}

.login-link {
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #764ba2;
  }

  i {
    margin-right: 0.5rem;
  }
}

@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px) rotateX(-10deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0);
  }
}

.form-control {
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  &.is-invalid {
    border-color: #e53e3e;

    &:focus {
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }
  }
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 0.75rem;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}
</style>