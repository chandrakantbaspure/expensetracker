<template>
  <div class="empty-state">
    <i :class="icon" class="empty-icon"></i>
    <h4>{{ title }}</h4>
    <p class="text-muted">{{ message }}</p>
    <slot name="action"></slot>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      default: 'bi bi-inbox'
    }
  }
};
</script>

<style scoped>
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #ccc;
  margin-bottom: 1rem;
}
</style>
