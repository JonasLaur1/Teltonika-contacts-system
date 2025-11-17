<script setup lang="ts">
type DisplayStyle = "grid" | "list";

defineProps<{
  currentType: DisplayStyle;
}>();

const emit = defineEmits<{
  toggle: [];
}>();
</script>

<template>
  <button
    @click="emit('toggle')"
    class="bg-[#0054A6] rounded flex items-center justify-center w-10 h-10"
  >
  <img
    :src="`/src/assets/images/${currentType}.svg`"
    :alt="`${currentType} view`"
  />
  </button>
</template>