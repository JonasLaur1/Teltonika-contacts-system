<script setup lang="ts">
const emit = defineEmits<{
  createCompany: []
}>();

defineProps<{
  size?: number
}>()
</script>

<template>
  <button 
    :class="[
      'bg-[#0054A6] shadow shadow-xl rounded flex items-center justify-center hover:bg-[#1F3F77] transition-colors',
      size ? `w-${size} h-${size}` : 'w-12 h-12'
    ]"
    @click="emit('createCompany')"
    aria-label="Sukurti naują įmonę"
  >
    <img
      src="../assets/images/plus.svg"
      alt="Pridėti naują įmonę"
      class="w-6 h-6"
    />
  </button>
</template>