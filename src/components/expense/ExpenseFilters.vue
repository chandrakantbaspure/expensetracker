<template>
  <div class="filters-container">
    <div class="row g-3">
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label">Search</label>
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input 
              v-model="localFilters.keyword" 
              type="text" 
              class="form-control" 
              placeholder="Search expenses..."
            >
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label">Category</label>
          <select 
            v-model="localFilters.category" 
            class="form-select"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label">Start Date</label>
          <input 
            v-model="localFilters.dateRange.start" 
            type="date" 
            class="form-control"
          >
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="form-group">
          <label class="form-label">End Date</label>
          <input 
            v-model="localFilters.dateRange.end" 
            type="date" 
            class="form-control"
          >
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-end mt-3">
      <button 
        @click="resetFilters" 
        class="btn btn-outline-secondary me-2"
      >
        <i class="bi bi-arrow-counterclockwise me-2"></i>
        Reset Filters
      </button>
      <button 
        @click="applyFilters" 
        class="btn btn-primary"
      >
        <i class="bi bi-funnel me-2"></i>
        Apply Filters
      </button>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ExpenseFilters',
  data() {
    return {
      localFilters: {
        keyword: '',
        category: '',
        dateRange: {
          start: '',
          end: ''
        }
      }
    };
  },
  computed: {
    ...mapState('expenses', ['categories'])
  },
  methods: {
    resetFilters() {
      this.localFilters = {
        keyword: '',
        category: '',
        dateRange: {
          start: '',
          end: ''
        }
      };
      this.$emit('update:filters', this.localFilters);
    },
    applyFilters() {
      this.$emit('update:filters', this.localFilters);
    }
  },
  created() {
    const currentFilters = this.$store.state.expenses.filters;
    this.localFilters = JSON.parse(JSON.stringify(currentFilters));
  }
};
</script>

<style scoped>
.filters-container {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 0;
}

.form-label {
  font-weight: 500;
  color: #344767;
  margin-bottom: 0.5rem;
}
</style>