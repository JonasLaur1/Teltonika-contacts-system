<script setup lang="ts">
import { ref, watch } from "vue";
import { defineEmits } from "vue";

const props = defineProps<{
    modalState: boolean
    deleteForm: boolean
}>()
const modalState = ref(props.modalState || false);

watch(() => props.modalState, (newValue) => 
modalState.value = newValue)

const emit = defineEmits<{
  (e: 'closeModal', state: boolean) : void
}>()

const closeModal = () => {
  modalState.value = false
  emit("closeModal", false)
}
</script>

<template>
  <div v-if="modalState" class="modal modal-open">
    <div class="modal-box">
      <form method="dialog" v-if="!deleteForm">
        <button 
          class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" 
          @click.prevent="closeModal"
          type="button"
        >
          ✕
        </button>
      </form>
      <slot></slot>
    </div>
    <div class="modal-backdrop" @click="closeModal"></div>
  </div>
</template>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 1000px;
  width: 90%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
