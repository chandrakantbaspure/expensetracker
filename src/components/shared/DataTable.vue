<template>
  <div class="data-table">
    <!-- Table Header with Search and Filters -->
    <div class="table-header mb-3">
      <div class="row align-items-center">
        <div class="col">
          <div class="input-group">
            <span class="input-group-text">
              <i class="bi bi-search"></i>
            </span>
            <input
              v-model="searchQuery"
              type="text"
              class="form-control"
              placeholder="Search..."
              @input="handleSearch"
            >
          </div>
        </div>
        <div class="col-auto">
          <slot name="actions"></slot>
        </div>
      </div>
    </div>

    <!-- Table Content -->
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th 
              v-for="column in columns" 
              :key="column.key"
              @click="handleSort(column)"
              :class="{ sortable: column.sortable }"
            >
              {{ column.label }}
              <i 
                v-if="column.sortable" 
                class="bi" 
                :class="getSortIcon(column.key)"
              ></i>
            </th>
            <th v-if="$slots.actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id">
            <td v-for="column in columns" :key="column.key">
              <slot :name="column.key" :item="item">
                {{ column.format ? column.format(item[column.key]) : item[column.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions">
              <slot name="actions" :item="item"></slot>
            </td>
          </tr>
          <tr v-if="!paginatedData.length">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center py-4">
              <EmptyState
                :title="emptyStateTitle"
                :message="emptyStateMessage"
                :icon="emptyStateIcon"
              >
                <template #action>
                  <slot name="empty-action"></slot>
                </template>
              </EmptyState>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="d-flex justify-content-between align-items-center mt-3">
      <div class="text-muted">
        Showing {{ paginationInfo.from }} to {{ paginationInfo.to }} of {{ filteredData.length }} entries
      </div>
      <nav v-if="totalPages > 1">
        <ul class="pagination mb-0">
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === 1 }"
          >
            <button 
              class="page-link" 
              @click="changePage(currentPage - 1)"
            >
              Previous
            </button>
          </li>
          <li 
            v-for="page in displayedPages" 
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
          >
            <button 
              class="page-link" 
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </li>
          <li 
            class="page-item" 
            :class="{ disabled: currentPage === totalPages }"
          >
            <button 
              class="page-link" 
              @click="changePage(currentPage + 1)"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import EmptyState from './EmptyState.vue';

export default {
  name: 'DataTable',
  components: {
    EmptyState
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    itemsPerPage: {
      type: Number,
      default: 10
    },
    emptyStateTitle: {
      type: String,
      default: 'No Data Found'
    },
    emptyStateMessage: {
      type: String,
      default: 'There are no items to display.'
    },
    emptyStateIcon: {
      type: String,
      default: 'bi bi-inbox'
    }
  },
  data() {
    return {
      currentPage: 1,
      searchQuery: '',
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  computed: {
    filteredData() {
      let filtered = [...this.data];
      
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(item => 
          this.columns.some(column => {
            const value = item[column.key];
            return value && String(value).toLowerCase().includes(query);
          })
        );
      }

      if (this.sortKey) {
        filtered.sort((a, b) => {
          const aVal = a[this.sortKey];
          const bVal = b[this.sortKey];
          
          if (typeof aVal === 'string') {
            return this.sortOrder === 'asc' 
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
          
          return this.sortOrder === 'asc' 
            ? aVal - bVal 
            : bVal - aVal;
        });
      }

      return filtered;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    },
    displayedPages() {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];
      let l;

      range.push(1);

      for (let i = this.currentPage - delta; i <= this.currentPage + delta; i++) {
        if (i < this.totalPages && i > 1) {
          range.push(i);
        }
      }

      range.push(this.totalPages);

      for (let i of range) {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push('...');
          }
        }
        rangeWithDots.push(i);
        l = i;
      }

      return rangeWithDots;
    },
    paginationInfo() {
      const from = (this.currentPage - 1) * this.itemsPerPage + 1;
      const to = Math.min(from + this.itemsPerPage - 1, this.filteredData.length);
      return { from, to };
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1;
    },
    handleSort(column) {
      if (!column.sortable) return;

      if (this.sortKey === column.key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = column.key;
        this.sortOrder = 'asc';
      }
    },
    getSortIcon(key) {
      if (this.sortKey !== key) return 'bi-arrow-down-up';
      return this.sortOrder === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  watch: {
    data() {
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.sortable {
  cursor: pointer;
}

.sortable:hover {
  background-color: #f8f9fa;
}

.bi {
  margin-left: 0.5rem;
  font-size: 0.875rem;
}

.pagination {
  margin-bottom: 0;
}

.page-link {
  padding: 0.375rem 0.75rem;
}
</style>
