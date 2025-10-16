<script setup lang="ts">
import type Company from '@/types/Companies';
import { useAuthStore } from '@/stores/AuthStore';

const authStore = useAuthStore()

const props = defineProps<{
    company: Company
}>()

const emit = defineEmits<{
  editCompany: [company: Company]
  deleteCompany: [company: Company]
}>()

</script>

<template>
          <tr class="hover:bg-gray-50 transition-colors duration-200">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ company.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex justify-end gap-2">
                    <button v-if="authStore.userPermissions.canEditCompanies" @click="emit('editCompany', props.company)" class="bg-[#0054A6] rounded-full px-8 py-2 text-white text-sm min-w-[350px]">
                        Redaguoti
                    </button>
                    <button v-if="authStore.userPermissions.canDeleteCompanies" @click="emit('deleteCompany', props.company)" class="bg-[#A61A11] rounded-full px-6 py-2 text-white text-sm min-w-[150px]">
                        Ištrinti
                    </button>
                </div>
            </td>
          </tr>
</template>