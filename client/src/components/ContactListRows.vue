<script setup lang="ts">
import type Employee from '@/types/Employee';
import { getEmployeePhoto } from "@/utils/photoUtils";
import router from '@/router';

const props = defineProps<{
    employee: Employee
}>()

const openDetails = () =>{
  router.push({
    name: 'detailed-contact',
    params: {id: props.employee.id}
  })
}
</script>

<template>
          <tr
            class="hover:bg-gray-50 transition-colors duration-200"
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
              <div class="text-sm text-gray-900">
                <a
                  :href="`mailto:${employee.email}`"
                  class="text-blue-600 hover:text-blue-800"
                >
                  {{ employee.email }}
                </a>
              </div>
            </td>

            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">
                {{ employee.expand?.office_id?.name || "Nenurodyta" }}
              </div>
            </td>
          </tr>
</template>