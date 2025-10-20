<script setup lang="ts" generic="T extends Record<string, any>">
import { useAuthStore } from "@/stores/AuthStore";

const authStore = useAuthStore();

const props = defineProps<{
  item: T;
  columns: Array<{ key: string; label: string }>;
}>();

const emit = defineEmits<{
  editItem: [item: T];
  deleteItem: [item: T];
}>();
</script>

<template>
  <tr class="hover:bg-gray-50 transition-colors duration-200">
    <td
      v-for="col in columns"
      :key="col.key"
      class="px-6 py-4 whitespace-nowrap"
    >
      <div v-if="col.key !== 'actions'" class="text-sm text-gray-900">
        {{ item[col.key] || "-" }}
      </div>
      <div v-else class="flex justify-end gap-2">
        <button
          v-if="authStore.userPermissions.canEditCompanies"
          @click="emit('editItem', item)"
          class="bg-[#0054A6] rounded-full px-8 py-2 text-white text-sm min-w-[150px]"
        >
          Redaguoti
        </button>
        <button
          v-if="authStore.userPermissions.canDeleteCompanies"
          @click="emit('deleteItem', item)"
          class="bg-[#A61A11] rounded-full px-6 py-2 text-white text-sm min-w-[120px]"
        >
          Ištrinti
        </button>
      </div>
    </td>
  </tr>
</template>
