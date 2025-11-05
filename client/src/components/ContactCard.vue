<script setup lang="ts">
import type Employee from "@/types/Employee";
import router from "@/router";
import { getEmployeePhoto } from "@/utils/photoUtils";
import EditButton from "@/components/EditButton.vue";
import DeleteButton from "@/components/DeleteButton.vue";

const props = defineProps<{
  employee: Employee;
}>();

const emit = defineEmits<{
  edit: [employee: Employee];
  delete: [employee: Employee];
}>();

const openDetails = () => {
  router.push({
    name: "detailed-contact",
    params: { id: props.employee.id },
  });
};

const handleEdit = () => {
  emit("edit", props.employee);
};

const handleDelete = () => {
  emit("delete", props.employee);
};
</script>

<template>
  <div
    class="rounded p-8 shadow-md cursor-pointer overflow-hidden"
    @click="openDetails()"
  >
    <div class="flex gap-6 mb-6">
      <img
        :src="getEmployeePhoto(employee)"
        alt="Profile"
        class="w-16 h-16 rounded-full"
      />
      <div class="flex flex-col">
        <p class="font-bold">{{ employee.name }} {{ employee.surname }}</p>
        <p class="text-sm">Pozicija: {{ employee.position }}</p>
      </div>
    </div>
    <div class="mb-4">
      <p>Telefono nr: {{ employee.phone_number ?? "-" }}</p>
      <p>El. paštas: {{ employee.email }}</p>
      <p>Adresas: {{ employee.expand.office_id.name }}</p>
    </div>
    <div class="flex gap-2">
      <div @click.stop>
        <EditButton @click="handleEdit" />
      </div>
      <div @click.stop>
        <DeleteButton @click="handleDelete" />
      </div>
    </div>
  </div>
</template>