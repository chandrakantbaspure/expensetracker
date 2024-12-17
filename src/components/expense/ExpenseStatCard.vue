<template>
  <div class="stat-card" :class="bgClass">
    <h6>{{ title }}</h6>
    <h3>{{ formattedValue }}</h3>
    <small v-if="subtitle">{{ subtitle }}</small>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/currency';

export default {
  name: 'ExpenseStatCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [Number, String],
      required: true
    },
    subtitle: {
      type: String,
      default: ''
    },
    bgClass: {
      type: String,
      default: 'bg-primary text-white'
    },
    isCurrency: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValue() {
      return this.isCurrency ? formatCurrency(this.value) : this.value;
    }
  }
}
</script>

<style scoped>
.stat-card {
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>