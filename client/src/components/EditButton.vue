<script setup lang="ts">
import editIcon from "@/assets/images/edit.svg";

const emit = defineEmits<{
  click: []
}>();
</script>

<template>
  <button 
    class="bg-[#0054A6] shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#003d7a] transition-colors"
    @click="emit('click')"
    aria-label="Redaguoti"
  >
    <img
      :src="editIcon"
      alt="Redaguoti"
      class="w-8 h-8"
    />
  </button>
</template>