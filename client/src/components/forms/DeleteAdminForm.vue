<script lang="ts" setup>
import adminService from "@/services/adminService";
import { useNotificationStore } from "@/stores/NotificationStore";
import type User from "@/types/User";
import { ref } from "vue";

const isLoading = ref(false);

const notificationStore = useNotificationStore();

const emit = defineEmits(["closeModal", "itemDeleted"]);

const props = defineProps<{
  admin: User | null;
}>();

const handleDelete = async () => {
  try {
    const response = await adminService.deleteAdmin(props.admin!.id);
    notificationStore.addSuccessNotification(
      "Sėkmingai ištrinta paskyra " + props.admin?.email
    );
    emit("closeModal");
  } catch (error) {
    notificationStore.addErrorNotification(
      "Nepavyko ištrinti paskyros " + props.admin?.email
    );
    emit("closeModal");
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Ar tikrai norite ištrinti paskyrą?</h1>
    <p>Paskyros vardas: {{ admin!.username }}</p>
    <div class="flex justify-end gap-6 text-[#0054A6] font-medium text-lg">
      <button
        @click="emit('closeModal')"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors"
      >
        Ne
      </button>
      <button
        @click="handleDelete"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors flex items-center"
      >
        <span
          v-if="isLoading"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
        ></span>
        {{ isLoading ? "Trinama..." : "Taip" }}
      </button>
    </div>
  </div>
</template>
