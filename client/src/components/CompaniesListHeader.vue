<script setup lang="ts">
const props = defineProps<{
  columns: { key: string; label: string }[]
}>()
</script>

<template>
  <thead class="bg-gray-50 border-b border-gray-200">
    <tr>
      <th
        v-for="(column, index) in columns"
        :key="column.key"
        :class="[
          'py-4 text-xs font-medium text-gray-500 uppercase tracking-wider',
          index === columns.length - 1 ? 'text-right pr-64' : 'text-left px-6'
        ]"
      >
        {{ column.label }}
      </th>
    </tr>
  </thead>
</template>
