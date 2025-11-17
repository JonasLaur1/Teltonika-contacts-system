<script setup lang="ts">

const props = defineProps<{
  totalPages: number;
  currentPage: number;
}>();

const emit = defineEmits<{
  "update:currentPage": [page: number];
}>();

const nextPage = () => {
  if (props.currentPage === props.totalPages) return;
  emit("update:currentPage", props.currentPage + 1);
};

const previousPage = () => {
  if (props.currentPage <= 1) return;
  emit("update:currentPage", props.currentPage - 1);
};
</script>

<template>
  <div class="flex justify-center items-center gap-4 mb-8">
    <button
      class="flex items-center justify-between gap-2 px-6 py-2 min-w-[260px] rounded bg-[#0054A6] hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
      :disabled="currentPage <= 1"
      @click="previousPage"
    >
      <img
        src="../assets/images/previous.svg"
        alt="Previous page arrow"
        class="w-4 h-4"
      />
      <span>Praeitas puslapis</span>
    </button>
    <span class="text-xl">{{ currentPage }}/{{ totalPages }}</span>
    <button
      class="flex items-center justify-between gap-2 px-6 py-2 min-w-[260px] rounded bg-[#0054A6] hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400"
      :disabled="currentPage >= totalPages"
      @click="nextPage"
    >
      <span>Kitas puslapis</span>
      <img
        src="../assets/images/next.svg"
        alt="Next page arrow"
        class="w-4 h-4"
      />
    </button>
  </div>
</template>
