<script setup lang="ts">
import { ref, reactive, onMounted, computed } from "vue";
import { useNotificationStore } from "@/stores/NotificationStore";
import { useAuthStore } from "@/stores/AuthStore";
import companiesService from "@/services/companiesService";
import structureService from "@/services/structureService";
import type Company from "@/types/Companies";
import { trimText } from "@/utils/textTrimming";
import { OFFICE_FIELDS } from "@/constants/officeFormFields";

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const emit = defineEmits<{
  closeModal: [];
  officeCreated: [];
}>();

const companies = ref<Company[]>([]);
const selected = ref<string[]>([]);
const isLoading = ref(false);

const formData = reactive({
  officeName: "",
  street: "",
  streetNumber: "",
  city: "",
  country: "",
});

const errors = ref<Record<string, string>>({});

const fields = OFFICE_FIELDS

const getCompanies = async () => {
  try {
    const result = await companiesService.getCompanies();
    companies.value = result.items;
  } catch (error) {
    console.error("Failed to load companies:", error);
    notificationStore.addErrorNotification("Nepavyko užkrauti įmonių sąrašo");
  }
};

const toggleSelection = (id: string) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((i) => i !== id);
  } else {
    selected.value.push(id);
  }
  if (errors.value.companies) errors.value.companies = "";
};

const validateForm = (): boolean => {
  errors.value = {};

  fields.forEach((field) => {
    const value = formData[field.key as keyof typeof formData];
    if (field.required && !value) {
      errors.value[field.key] = "Šis laukas yra privalomas";
    } else if (field.validate) {
      const error = field.validate(value);
      if (error) errors.value[field.key] = error;
    }
  });

  if (selected.value.length === 0) {
    errors.value.companies = "Pasirinkite bent vieną įmonę";
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!authStore.checkAuth()) return;
  if (!authStore.userPermissions.canEditOffices) {
    notificationStore.addErrorNotification(
      "Neturi reikiamų teisių šiam veiksmui."
    );
    return;
  }
  if (!validateForm()) return;
  if (isLoading.value) return;

  try {
    isLoading.value = true;

    const officeData = {
      name: trimText(formData.officeName),
      street: trimText(formData.street),
      street_number: trimText(formData.streetNumber),
      city: trimText(formData.city),
      country: trimText(formData.country),
    };

    const createdOffice = await structureService.createStructure(
      "offices",
      officeData
    );

    for (const companyId of selected.value) {
      try {
        await structureService.linkStructures("companies_offices", {
          company_id: companyId,
          office_id: createdOffice.id,
        });
      } catch (err) {
        console.error(`Failed to link company ${companyId}:`, err);
      }
    }

    notificationStore.addSuccessNotification("Ofisas sukurtas sėkmingai");
    emit("officeCreated");
  } catch (error: any) {
    console.error("Failed to create office:", error);
    notificationStore.addErrorNotification(
      error.message || "Klaida kuriant ofisą. Bandykite dar kartą."
    );
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => getCompanies());

const selectedCount = computed(() => selected.value.length);
const canSubmit = computed(() => {
  const allFieldsFilled = fields.every((field) => {
    const value = formData[field.key as keyof typeof formData];
    return field.required ? value && value.toString().trim() !== "" : true;
  });

  const hasCompanySelected = selected.value.length > 0;

  return allFieldsFilled && hasCompanySelected && !isLoading.value;
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Pridėkite naują ofisą</h1>
    <form @submit.prevent="handleSubmit">
      <div class="flex gap-8">
        <div class="flex flex-col gap-4 flex-1">
          <div v-for="field in fields" :key="field.key">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              field.label
            }}</label>
            <input
              v-model="formData[field.key as keyof typeof formData]"
              type="text"
              :placeholder="field.placeholder"
              @input="errors[field.key] = ''"
              @blur="
                errors[field.key] = field.validate
                  ? field.validate(formData[field.key as keyof typeof formData])
                  : ''
              "
              :class="[
                'w-full bg-[#F1F2F4] p-3 rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors[field.key]
                  ? 'border-2 border-red-500 focus:ring-red-500'
                  : 'border border-gray-300 focus:ring-blue-500',
              ]"
            />
            <p v-if="errors[field.key]" class="text-red-500 text-sm mt-1">
              {{ errors[field.key] }}
            </p>
          </div>
        </div>

        <div class="flex flex-col w-80">
          <label class="mb-3 font-medium text-gray-700"
            >Pasirinkite įmones:</label
          >
          <div
            class="overflow-y-auto max-h-80 space-y-2 pr-2 border rounded-md p-3 bg-gray-50"
          >
            <button
              v-for="company in companies"
              :key="company.id"
              type="button"
              @click="toggleSelection(company.id)"
              :class="[
                'w-full rounded-md py-3 px-4 text-left shadow-sm transition-all duration-200',
                selected.includes(company.id)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200',
              ]"
            >
              {{ company.name }}
            </button>
          </div>
          <p v-if="errors.companies" class="text-red-500 text-sm mt-1">
            {{ errors.companies }}
          </p>
          <p v-if="selectedCount > 0" class="text-sm text-gray-600 mt-2">
            Pasirinkta: {{ selectedCount }} įmonė(s)
          </p>
        </div>
      </div>

      <div class="flex justify-start gap-4 mt-8">
        <button
          type="submit"
          :disabled="!canSubmit"
          class="px-8 py-3 bg-[#0054A6] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
        >
          <span
            v-if="isLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></span>
          {{ isLoading ? "Kuriama..." : "Sukurti ofisą" }}
        </button>
      </div>
    </form>
  </div>
</template>
