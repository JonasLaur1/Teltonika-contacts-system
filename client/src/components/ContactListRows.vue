<script setup lang="ts">
import type Employee from "@/types/Employee";
import { getEmployeePhoto } from "@/utils/photoUtils";
import router from "@/router";
import EditButton from "./EditButton.vue";
import DeleteButton from "./DeleteButton.vue";

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
  <tr
    class="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
    @click="openDetails()"
  >
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center gap-4">
        <img
          :src="getEmployeePhoto(employee)"
          alt="Profile"
          class="w-10 h-10 rounded-full bg-gray-100 p-2"
        />
        <div>
          <div class="text-sm font-medium text-gray-900">
            {{ employee.name }} {{ employee.surname }}
          </div>
        </div>
      </div>
    </td>

    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">{{ employee.position }}</div>
    </td>

    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
        {{ employee.phone_number }}
      </div>
    </td>

    <td class="px-6 py-4 whitespace-nowrap">
      <a
        :href="`mailto:${employee.email}`"
        class="text-blue-600 hover:text-blue-800"
        @click.stop
      >
        {{ employee.email }}
      </a>
    </td>

    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-900">
        {{ employee.expand?.office_id?.name || "Nenurodyta" }}
      </div>
    </td>

    <td class="px-6 py-4 whitespace-nowrap">
      <div @click.stop class="flex items-center gap-2">
        <EditButton @click="handleEdit" />
        <DeleteButton @click="handleDelete" />
      </div>
    </td>
  </tr>
</template>
