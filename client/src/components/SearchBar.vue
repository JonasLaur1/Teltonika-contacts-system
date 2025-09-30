<script setup lang="ts">
import { ref, defineEmits } from "vue";
import debounce from "debounce";

const emit = defineEmits<{
  (e: "searchingQuery", value: string): void;
}>();

const searchQuery = ref("");

const debouncedEmit = debounce((value: string) => {
  emit("searchingQuery", value);
}, 300);
</script>

<template>
  <div class="relative w-1/4">
    <img
      src="../assets/images/search.svg"
      alt="Search Icon"
      class="absolute pointer-events-none left-0 top-1/2 -translate-y-1/2 items-center pl-3 z-10"
    />
    <input
      type="text"
      @input="debouncedEmit(searchQuery)"
      v-model="searchQuery"
      class="bg-[#F1F2F4] pl-10 pr-3 py-2 border rounded-t focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      placeholder="Ieškoti kontakto..."
    />
  </div>
</template>
