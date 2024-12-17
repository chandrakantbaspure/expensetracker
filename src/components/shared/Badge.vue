<template>
  <span 
    class="badge" 
    :class="[variant, size, { 'rounded-pill': pill }]"
  >
    <i v-if="icon" :class="icon" class="me-1"></i>
    <slot></slot>
  </span>
</template>

<script>
export default {
  name: 'Badge',
  props: {
    variant: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: ''
    },
    pill: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.badge {
  font-weight: 500;
  padding: 0.5em 1em;
}

.badge.badge-sm {
  font-size: 0.75rem;
  padding: 0.25em 0.65em;
}

.badge.badge-lg {
  font-size: 1rem;
  padding: 0.65em 1.25em;
}
</style>
