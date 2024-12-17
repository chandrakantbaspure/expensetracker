<template>
  <div class="app-layout">
    <Sidebar />
    <main class="main-content">
      <div class="container-fluid py-4">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue';

export default {
  name: 'AppLayout',
  components: {
    Sidebar
  }
};
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-content {
  margin-left: 250px;
  padding: 20px;
  min-height: 100vh;
}
</style>
