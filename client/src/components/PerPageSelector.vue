<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  currentValue: number | "All";
  options: (number | "All")[];
}>();

const emit = defineEmits<{
  change: [value: number | "All"];
}>();

const isOpen = ref(false);

const handleChange = (value: number | "All") => {
  emit('change', value);
  isOpen.value = false;
};
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="bg-[#0054A6] rounded flex items-center justify-center w-10 h-10"
    >
      <img
        src="../assets/images/perpage.svg"
        alt="Per page button"
        class="pt-1"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute bg-[#0054A6] border rounded shadow-lg w-10 z-50 text-center rounded-lg text-sm"
    >
      <ul>
        <li
          v-for="value in options"
          :key="value"
          @click="handleChange(value)"
          class="cursor-pointer border-b border-white rounded-sm"
        >
          {{ value }}
        </li>
      </ul>
    </div>
  </div>
</template>