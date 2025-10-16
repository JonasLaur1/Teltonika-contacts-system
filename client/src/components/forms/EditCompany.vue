<script setup lang="ts">
import companiesService from "@/services/companiesService";
import type Company from "@/types/Companies";
import { computed, ref } from "vue";
import { useNotificationStore } from "@/stores/NotificationStore";
import { validateName } from "@/utils/Validations";
import { trimText } from "@/utils/textTrimming";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "vue-router";
import structureService from "@/services/structureService";
const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const props = defineProps<{
  company: Company | null;
  createNew: boolean;
}>();

const newName = ref(props.company?.name || "");
const errorMessage = ref("");
const isLoading = ref(false);

const emit = defineEmits<{
  updatedName: [];
}>();

const handleEdit = async () => {
  try {
    if (
      !props.createNew &&
      props.company?.name.toLowerCase() === newName.value.toLowerCase()
    ) {
      notificationStore.addAlertNotification(
        "Pavadinimai sutampa, nėra ką atnaujinti."
      );
      return;
    }

    if (!authStore.checkAuth()) {
      notificationStore.addErrorNotification(
        "Sesija pasibaigė. Prisijunkite dar kartą."
      );
      router.push("/login");
      return;
    }

    if (!authStore.userPermissions.canEditCompanies) {
      notificationStore.addErrorNotification(
        "Neturi reikiamų tiesių, kad atlikti šį veiksmą."
      );
      return;
    }

    const lowerName = trimText(newName.value).toLowerCase();
    const existing = await companiesService.getCompanies(1, 1, lowerName);

    if (props.createNew) {
      if (existing.items.length > 0) {
        notificationStore.addErrorNotification(
          "Įmonė su tokiu pavadinimu jau egzistuoja"
        );
        return;
      }
    } else {
      if (
        existing.items.length > 0 &&
        existing.items[0].id !== props.company!.id
      ) {
        notificationStore.addErrorNotification(
          "Įmonė su tokiu pavadinimu jau egzistuoja"
        );
        return;
      }
    }

    if (props.createNew) {
      isLoading.value = true;
      await companiesService.createCompany(trimText(newName.value));
      notificationStore.addSuccessNotification("Įmonė sukurta sėkmingai");
    } else {
      isLoading.value = true;
      await companiesService.updateCompany(
        props.company!.id,
        trimText(newName.value)
      );
      notificationStore.addSuccessNotification("Įmonė atnaujinta sėkmingai");
    }

    emit("updatedName");
  } catch (error: any) {
    if (error?.response?.data?.name?.code === "validation_not_unique") {
      notificationStore.addErrorNotification(
        "Įmonė su tokiu pavadinimu jau egzistuoja"
      );
    } else {
      notificationStore.addErrorNotification(
        "Įvyko klaida, bandykite dar kartą"
      );
    }
  } finally {
    isLoading.value = false;
  }
};

const isCreating = computed(() => (props.createNew ? "Sukurti" : "Redaguoti"));
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-3xl">{{ isCreating }} įmonę:</h1>

    <label for="name">Įmonės pavadinimas:</label>
    <input
      type="text"
      name="name"
      @input="errorMessage = ''"
      @blur="errorMessage = validateName(trimText(newName))"
      id="name"
      v-model="newName"
      maxlength="50"
      placeholder="Įveskite įmonės pavadinimą..."
      :class="[
        'bg-[#F1F2F4] p-2 rounded focus:outline-none focus:ring-2',
        errorMessage
          ? 'border-2 border-red-500 focus:ring-red-500'
          : 'border border-gray-300 focus:ring-blue-500',
      ]"
    />
    <p v-if="errorMessage" class="text-red-600 text-sm mt-1">
      {{ errorMessage }}
    </p>

    <button
      class="bg-[#0054A6] w-2/3 p-2 rounded-md text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      @click="handleEdit"
      :disabled="!!errorMessage || isLoading"
    >
      <span
        v-if="isLoading"
        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
      ></span>
      {{
        isLoading
          ? props.createNew
            ? "Kuriama..."
            : "Atnaujinama..."
          : isCreating
      }}
    </button>
  </div>
</template>
