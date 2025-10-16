<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<template>
<div class="text-center py-12">
      <p class="text-gray-500 text-3xl">{{message}}</p>
</div>
</template>