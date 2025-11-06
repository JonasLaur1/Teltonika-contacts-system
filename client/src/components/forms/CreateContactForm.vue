<script setup lang="ts">
import { onMounted } from "vue";
import { useNotificationStore } from "@/stores/NotificationStore";
import employeeService from "@/services/employeeService";
import type Employee from "@/types/Employee";
import Filters from "@/components/Filters.vue";
import FormInput from "@/components/FormInput.vue";
import { useContactForm } from "@/constants/useContactForm";
import { validatePersonName, validateName, validateEmail } from "@/utils/Validations"; // Updated import

const notificationStore = useNotificationStore();

const props = defineProps<{
  mode?: "create" | "edit";
  employee?: Employee | null;
}>();

const emit = defineEmits<{
  created: [];
  updated: [];
}>();

const {
  name,
  surname,
  position,
  email,
  phoneNumber,
  selectedFile,
  currentAvatar,
  errors,
  isLoading,
  selectedFilters,
  headerText,
  submitButtonText,
  buttonText,
  canSubmit,
  validateForm,
  initializeForm,
  handleFiltersChanged,
  handleFileChange,
  buildEmployeeData,
  hasChanges,
} = useContactForm(props);

const handleSubmit = async () => {
  if (!validateForm()) return;

  if (props.mode === "edit" && !hasChanges()) {
    notificationStore.addAlertNotification("Nėra jokių pakeitimų");
    return;
  }

  isLoading.value = true;

  try {
    const employeeData = buildEmployeeData();

    if (props.mode === "edit" && props.employee?.id) {
      await employeeService.updateEmployee(props.employee.id, employeeData);
      notificationStore.addSuccessNotification(
        `Kontaktas ${employeeData.email} sėkmingai atnaujintas!`
      );
      emit("updated");
    } else {
      console.log(employeeData.photo)
      await employeeService.addEmployee(employeeData);
      notificationStore.addSuccessNotification("Kontaktas sėkmingai pridėtas!");
      emit("created");
    }
  } catch (error) {
    notificationStore.addErrorNotification(
      `Klaida saugant kontaktą ${email.value}`
    );
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(initializeForm);
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">{{ headerText }}</h1>

    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-5xl">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-4">
          <FormInput
            v-model="name"
            label="Vardas"
            required
            placeholder="Įveskite vardą..."
            :error="errors.name"
            @update:modelValue="errors.name = ''"
            @blur="errors.name = validatePersonName(name)"
          />

          <FormInput
            v-model="surname"
            label="Pavardė"
            required
            placeholder="Įveskite pavardę..."
            :error="errors.surname"
            @update:modelValue="errors.surname = ''"
            @blur="errors.surname = validatePersonName(surname)"
          />

          <FormInput
            v-model="position"
            label="Pozicija"
            required
            placeholder="Įveskite poziciją..."
            :error="errors.position"
            @update:modelValue="errors.position = ''"
            @blur="errors.position = validateName(position)"
          />

          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">
              Kontaktinė informacija:
            </h3>
            <div class="space-y-3">
              <FormInput
                v-model="email"
                type="email"
                label="Elektroninis paštas"
                required
                placeholder="Įveskite el. paštą..."
                :error="errors.email"
                @update:modelValue="errors.email = ''"
                @blur="errors.email = validateEmail(email)"
              />

              <FormInput
                v-model="phoneNumber"
                type="tel"
                label="Telefono numeris"
                placeholder="Įveskite telefono numerį..."
              />
            </div>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">
              Įmonės detalės:
            </h3>

            <Filters
              layout="vertical"
              :initialValues="selectedFilters"
              @filtersChanged="handleFiltersChanged"
            />

            <div class="mt-2 space-y-1">
              <p v-if="errors.company" class="text-red-500 text-sm">
                {{ errors.company }}
              </p>
              <p v-if="errors.office" class="text-red-500 text-sm">
                {{ errors.office }}
              </p>
              <p v-if="errors.division" class="text-red-500 text-sm">
                {{ errors.division }}
              </p>
            </div>
          </div>

          <div>
            <label for="file-upload" class="cursor-pointer inline-block">
              <span
                class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {{ buttonText }}
              </span>
            </label>
            <p class="text-gray-500 text-sm mt-2">
              {{
                selectedFile || currentAvatar
                  ? "Photo has been uploaded."
                  : "No photo uploaded."
              }}
            </p>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="isLoading || !canSubmit"
          class="w-1/3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {{ submitButtonText }}
        </button>
      </div>
    </form>
  </div>
</template>
