<template>
  <div class="loading-overlay" v-if="loading">
    <div class="spinner-wrapper">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p v-if="message" class="mt-2 mb-0">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner-wrapper {
  text-align: center;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
