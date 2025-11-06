<script setup lang="ts">
defineProps<{
    password: string
}>()

</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Laikinas Slaptažodis:</h1>
    <p>Laikinas paskyros slaptažodis: {{ password }}</p>
  </div>
</template>
