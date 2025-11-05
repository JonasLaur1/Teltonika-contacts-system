<script setup lang="ts">
import deleteIcon from "@/assets/images/delete.svg";

const emit = defineEmits<{
  click: []
}>();
</script>

<template>
  <button 
    class="bg-[#C62828] shadow-md rounded-full w-12 h-12 flex items-center justify-center hover:bg-[#B71C1C] transition-colors"
    @click="emit('click')"
    aria-label="Ištrinti"
  >
    <img
      :src="deleteIcon"
      alt="Ištrinti"
      class="w-8 h-8"
    />
  </button>
</template>