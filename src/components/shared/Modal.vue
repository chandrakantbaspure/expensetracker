<template>
  <div 
    class="modal fade" 
    :class="{ show: modelValue }" 
    tabindex="-1" 
    :style="{ display: modelValue ? 'block' : 'none' }"
  >
    <div class="modal-dialog" :class="size">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <slot name="title">{{ title }}</slot>
          </h5>
          <button 
            type="button" 
            class="btn-close" 
            @click="$emit('update:modelValue', false)"
          ></button>
        </div>
        <div class="modal-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer">
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="$emit('update:modelValue', false)"
            >
              Close
            </button>
            <button 
              type="button" 
              class="btn btn-primary"
              @click="$emit('confirm')"
            >
              Confirm
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    }
  },
  watch: {
    modelValue(newVal) {
      if (newVal) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    }
  },
  beforeUnmount() {
    document.body.classList.remove('modal-open');
  }
};
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.modal.show {
  display: block;
}

.modal-dialog {
  margin: 1.75rem auto;
}
</style>
