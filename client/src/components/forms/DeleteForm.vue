<script setup lang="ts">
import type Company from "@/types/Companies";
import structureService from "@/services/structureService";
import companiesService from "@/services/companiesService";
import { useNotificationStore } from "@/stores/NotificationStore";
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

const props = defineProps<{
  company: Company | null;
}>();

const notificationStore = useNotificationStore()
const authStore = useAuthStore()

const emit = defineEmits(["closeModal", "companyDeleted"]);

const isLoading = ref(false)

const handleDeleteCompany = async () => {
  if (!props.company) return;

  authStore.checkAuth()
  if(!authStore.userPermissions.canDeleteCompanies){
    notificationStore.addErrorNotification("Neturi reikiamų tiesių, kad atlikti šį veiksmą.")
    return
  }

  if(isLoading.value) return
  try {
    isLoading.value = true
    const offices = await structureService.getLowerStructures(
      "companies",
      "companies_offices",
      props.company.id,
      "company_id",
      "office_id"
    );

    if (offices.length > 0) {
        notificationStore.addAlertNotification("Negalima ištrinti įmonės, kuri turi ofisą.")
        emit("closeModal")
      return;
    }

    await companiesService.deleteCompany(props.company.id);
    notificationStore.addSuccessNotification("Įmonė buvo sėkmingai ištrinta.")
    emit("companyDeleted");
  } catch (error) {
    notificationStore.addErrorNotification("Klaida bandant ištrinti įmonę. Bandykite dar kartą.")
  } finally{
    isLoading.value = false
  }
};
</script>

<template>
  <div v-if="company" class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">Ar tikrai norite ištrinti įmonę?</h1>
    <p class="text-xl text-gray-500">Įmonės pavadinimas: {{ company.name }}</p>
    <div class="flex justify-end gap-6 text-[#0054A6] font-medium text-lg">
      <button 
        @click="emit('closeModal')"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors"
      >
        Ne
      </button>
      <button 
        @click="handleDeleteCompany"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors flex items-center"
      >
        <span
          v-if="isLoading"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
        ></span>
        {{ isLoading ? 'Trinima...' : 'Taip' }}
      </button>
    </div>
  </div>
</template>
