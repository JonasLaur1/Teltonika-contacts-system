<script setup lang="ts">
import type Employee from "@/types/Employee";
import ContactListHeader from "./ContactListHeader.vue";
import ContactListRows from "./ContactListRows.vue";
import ContactListEmpty from "./ContactListEmpty.vue";

defineProps<{
  employees: Employee[];
}>();

const emit = defineEmits<{
  edit: [employee: Employee];
  delete: [employee: Employee];
}>();
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden w-10/11 my-4">
    <ContactListEmpty v-if="employees.length === 0" :message="'Darbuotojų sąrašas tuščias'"/>
    <div v-else class="overflow-x-auto">
      <table class="w-full border-collapse">
        <ContactListHeader />
        <tbody class="bg-white divide-y divide-gray-200">
          <ContactListRows 
            v-for="employee in employees" 
            :key="employee.id" 
            :employee="employee"
            @edit="emit('edit', $event)"
            @delete="emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>