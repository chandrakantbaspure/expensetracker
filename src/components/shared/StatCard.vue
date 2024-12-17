<template>
  <div 
    class="stat-card" 
    :class="[bgClass, { 'text-white': isGradient }]"
  >
    <div class="stat-icon">
      <i :class="icon"></i>
    </div>
    <div class="stat-content">
      <h3 class="stat-value">{{ formattedValue }}</h3>
      <p class="stat-label mb-0">{{ label }}</p>
    </div>
  </div>
</template>

<script>
import { formatCurrency } from '@/utils/currency';

export default {
  name: 'StatCard',
  props: {
    value: {
      type: [Number, String],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    bgClass: {
      type: String,
      default: 'bg-gradient-primary'
    },
    isCurrency: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    formattedValue() {
      return this.isCurrency ? formatCurrency(this.value) : this.value;
    },
    isGradient() {
      return this.bgClass.includes('gradient');
    }
  }
};
</script>

<style scoped>
.stat-card {
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  opacity: 0.8;
}
</style>
