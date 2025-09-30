<script setup lang="ts">
import ContactCard from "./ContactCard.vue";
import type Employee from "@/types/Employee";

defineProps<{
  employees: Employee[];
}>();
</script>

<template>
  <div v-if="employees.length > 0" class="grid grid-cols-4 gap-4 my-4">
    <ContactCard
      v-for="employee in employees"
      :key="employee.id"
      :employee="employee"
    />
  </div>

  <div v-else class="text-center py-12">
    <p class="text-gray-500 text-2xl">Darbuotojų sąrašas tuščias</p>
  </div>
</template>
