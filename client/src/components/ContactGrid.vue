<script setup lang="ts">
import type Employee from '@/types/Employee';
import ContactCard from './ContactCard.vue';

defineProps<{
  employees: Employee[];
  isLoading: boolean;
}>();

const emit = defineEmits<{
  edit: [employee: Employee],
  delete: [employee: Employee]
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <ContactCard 
      v-for="employee in employees" 
      :key="employee.id" 
      :employee="employee"
      @edit="emit('edit', $event)"
      @delete="emit('delete', $event)"
    />
  </div>
</template>