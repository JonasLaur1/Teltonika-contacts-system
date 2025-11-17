<script setup lang="ts">
import { ref } from "vue";
import { useNotificationStore } from "@/stores/NotificationStore";
import userService from "@/services/userService";
import BackButton from '@/components/BackButton.vue';
import { validateEmail } from '@/utils/Validations';

const email = ref("");
const emailError = ref("");
const isLoading = ref(false);
const notificationStore = useNotificationStore();

const validateEmailField = () => {
  emailError.value = validateEmail(email.value);
  return !emailError.value;
};

const handlePasswordReset = async () => {
  if (!validateEmailField()) {
    return;
  }

  isLoading.value = true;

  try {
    await userService.requestPasswordReset(email.value);
    notificationStore.addSuccessNotification(
      "Jei el. paštas egzistuoja, į jį buvo nusiųsta slaptažodžio atkūrimo nuoroda."
    );
    email.value = "";
    emailError.value = "";
  } catch (error: any) {
    notificationStore.addErrorNotification("Klaida siunčiant atkūrimo nuorodą. Bandykite dar kartą");
  } finally {
    isLoading.value = false;
  }
};

const clearError = () => {
  if (emailError.value) {
    emailError.value = "";
  }
};
</script>

<template>
  <div class="flex justify-center items-center bg-[#1F3F77] h-screen">
    <BackButton class="absolute top-8 left-8" />
    <div class="bg-white w-1/3 h-5/6 p-8 shadow-lg overflow-hidden">
      <h1 class="text-center text-5xl font-normal">Slaptažodžio atkūrimas</h1>
      <form @submit.prevent="handlePasswordReset" class="py-8 space-y-14 flex flex-col items-center justify-center">
        <div class="space-y-2 w-2/3">
          <label for="email" class="block">Elektroninis paštas:</label>
          <div class="relative">
            <img
              src="../assets/images/email.svg"
              alt="Email icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
            />
            <input
              v-model="email"
              @input="clearError"
              @blur="validateEmailField"
              type="email"
              id="email"
              placeholder="Įveskite el. pašto adresą..."
              name="email"
              required
              :disabled="isLoading"
              :class="[
                'w-full bg-[#F1F2F4] pl-12 pr-4 py-3 rounded focus:outline-none focus:ring-2 disabled:opacity-50',
                emailError ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'
              ]"
            />
          </div>
          <div v-if="emailError" class="text-red-500 text-sm mt-1 flex items-center">
            {{ emailError }}
          </div>
        </div>
        <button
          type="submit"
          class="w-1/2 bg-[#0054A6] text-white py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          {{isLoading ? 'Siunčiama...' : 'Siųsti'}}
        </button>
      </form>
    </div>
  </div>
</template>
