<script setup lang="ts">
import { ref } from "vue";
import type Employee from "@/types/Employee";
import employeeService from "@/services/employeeService";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useAuthStore } from "@/stores/AuthStore";

const props = defineProps<{
  employee: Employee | null;
}>();

const emit = defineEmits<{
  closeModal: [];
}>();

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const isLoading = ref(false);

const handleDelete = async () => {
  if (!props.employee) return;
  
  authStore.checkAuth();
  if (!authStore.userPermissions.canDeleteEmployees) {
    notificationStore.addErrorNotification(
      "Neturi reikiamų teisių, kad atlikti šį veiksmą."
    );
    return;
  }
  
  isLoading.value = true;
  try {
    await employeeService.deleteEmployee(props.employee.id);
    notificationStore.addSuccessNotification(
      "Darbuotojas buvo sėkmingai ištrintas."
    );
    emit("closeModal");
  } catch (error) {
    notificationStore.addErrorNotification(
      "Klaida bandant ištrinti darbuotoją. Bandykite dar kartą."
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="employee" class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      Ar tikrai norite ištrinti darbuotoją?
    </h1>
    <p class="text-xl text-gray-500">
      Darbuotojo vardas: {{ employee.name }} {{ employee.surname }}
    </p>
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