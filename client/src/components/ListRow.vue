<script setup lang="ts" generic="T extends Record<string, any>">
import { useAuthStore } from "@/stores/AuthStore";
import { computed } from "vue";

const authStore = useAuthStore();

const props = defineProps<{
  item: T;
  columns: Array<{ key: string; label: string }>;
  itemType?: "company" | "office" | "structure" | "admin";
}>();

const emit = defineEmits<{
  editItem: [item: T];
  deleteItem: [item: T];
  editPermissions: [item: T];
}>();

const canEdit = computed(() => {
  switch (props.itemType) {
    case "company":
      return authStore.userPermissions.canEditCompanies;
    case "office":
      return authStore.userPermissions.canEditOffices;
    case "structure":
      return authStore.userPermissions.canEditStructures;
    case "admin":
      return authStore.userPermissions.canEditPermissions;
    default:
      return authStore.userPermissions.canEditCompanies;
  }
});

const canDelete = computed(() => {
  switch (props.itemType) {
    case "company":
      return authStore.userPermissions.canDeleteCompanies;
    case "office":
      return authStore.userPermissions.canDeleteOffices;
    case "structure":
      return authStore.userPermissions.canDeleteStructures;
    case "admin":
      return authStore.userPermissions.canDeletePermissions;
    default:
      return authStore.userPermissions.canDeleteCompanies;
  }
});
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
      <div v-else class="flex justify-end gap-2 mr-8">
        <button
          v-if="itemType === 'admin' && canEdit"
          @click="emit('editPermissions', item)"
          class="bg-[#0054A6] rounded-full px-12 py-2 text-white text-sm min-w-[220px]"
        >
          Keisti Leidimus
        </button>
        <button
          v-if="canEdit"
          @click="emit('editItem', item)"
          class="bg-[#0054A6] rounded-full px-12 py-2 text-white text-sm min-w-[220px]"
        >
          Redaguoti
        </button>
        <button
          v-if="canDelete"
          @click="emit('deleteItem', item)"
          class="bg-[#A61A11] rounded-full px-10 py-2 text-white text-sm min-w-[160px]"
        >
          Ištrinti
        </button>
      </div>
    </td>
  </tr>
</template>
