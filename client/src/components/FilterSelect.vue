<script setup lang="ts">
interface Item {
  id: string;
  name: string;
}

const props = defineProps<{
  label: string;
  items: Item[];
  modelValue: string | null;
  placeholder: string;
  disabled?: boolean;
  emptyMessage?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string | null];
}>();
</script>

<template>
  <div class="filterContainer">
    <label>{{ label }}:</label>
    <select
      class="filter"
      :disabled="disabled"
      :value="modelValue"
      @change="
        emit(
          'update:modelValue',
          ($event.target as HTMLSelectElement).value || null
        )
      "
    >
      <option value="" :selected="modelValue === null">
        {{
          disabled
            ? placeholder
            : items.length === 0
            ? emptyMessage
            : placeholder
        }}
      </option>
      <option v-for="item in items" :key="item.id" :value="item.id">
        {{ item.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.filterContainer {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.filter {
  width: 100%;
  min-width: 0;
  border-radius: 0.25rem;
  background-color: white;
  border: 0.1rem solid #e0e0e0;
  padding: 0.25rem;
  color: #414042;
}
option {
  color: black;
}
</style>