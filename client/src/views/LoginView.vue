<script setup lang="ts">
import BackButton from "@/components/BackButton.vue";
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/NotificationStore";
import { validateEmail, validatePassword } from '@/utils/Validations';
import passwordShowIcon from '../assets/images/password-show.svg';
import passwordHideIcon from '../assets/images/password-hide.svg';

const notificationStore = useNotificationStore();
const authStore = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const isLoading = ref(false);
const passwordVisible = ref(false);

const validateEmailField = () => {
  emailError.value = validateEmail(email.value);
  return !emailError.value;
};

const validatePasswordField = () => {
  passwordError.value = validatePassword(password.value);
  return !passwordError.value;
};

const validateForm = () => {
  const isEmailValid = validateEmailField();
  const isPasswordValid = validatePasswordField();
  return isEmailValid && isPasswordValid;
};

const handleSubmit = async (event: Event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login(email.value, password.value);
    router.push("/");
  } catch (error: any) {
    if (error.message?.includes("authenticate") || error.status === 400) {
      notificationStore.addErrorNotification(
        "Neteisingas el. pašto adresas arba slaptažodis"
      );
    } else {
      notificationStore.addErrorNotification(
        "Prisijungimo klaida. Bandykite dar kartą"
      );
    }
    console.error("Login failed:", error);
  } finally {
    isLoading.value = false;
  }
};

</script>

<template>
  <div class="flex justify-center items-center bg-[#1F3F77] h-screen">
    <BackButton class="absolute top-8 left-8" />
    <div class="bg-white w-1/3 h-5/6 p-8 shadow-lg overflow-hidden">
      <h1 class="text-center text-5xl font-normal">Admin prisijungimas:</h1>
      <form
        @submit="handleSubmit"
        class="py-8 space-y-14 flex flex-col items-center"
      >
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
              @input="emailError = ''"
              @blur="validateEmailField"
              type="email"
              id="email"
              placeholder="Įveskite el. pašto adresą..."
              name="email"
              required
              :disabled="isLoading"
              :class="[
                'w-full bg-[#F1F2F4] pl-12 pr-4 py-3 rounded focus:outline-none focus:ring-2 disabled:opacity-50',
                emailError
                  ? 'border-2 border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500',
              ]"
            />
          </div>
          <div
            v-if="emailError"
            class="text-red-500 text-sm mt-1 flex items-center"
          >
            {{ emailError }}
          </div>
        </div>

        <div class="space-y-2 w-2/3">
          <label for="password" class="block">Slaptažodis:</label>
          <div class="relative">
            <img
              src="../assets/images/password.svg"
              alt="Password icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
            />
            <button
              @click="passwordVisible = !passwordVisible"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer z-10"
            >
              <img
                :src="passwordVisible ? passwordHideIcon : passwordShowIcon"
                alt="Password visibility icon"
              />
            </button>
            <input
              v-model="password"
              @input="passwordError = ''"
              @blur="validatePasswordField"
              :type="passwordVisible ? `text` : `password`"
              id="password"
              placeholder="Įveskite slaptažodį..."
              name="password"
              required
              :disabled="isLoading"
              :class="[
                'w-full bg-[#F1F2F4] pl-12 pr-12 py-3 rounded focus:outline-none focus:ring-2 disabled:opacity-50',
                passwordError
                  ? 'border-2 border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500',
              ]"
            />
          </div>
          <div
            v-if="passwordError"
            class="text-red-500 text-sm mt-1 flex items-center"
          >
            {{ passwordError }}
          </div>
        </div>

        <div class="w-2/3 text-left">
          <router-link
            to="/password-reset"
            class="text-[#0054A6] hover:underline"
          >
            Slaptažodžio atkūrimas
          </router-link>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !!emailError || !!passwordError"
          class="w-1/2 bg-[#0054A6] text-white py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span
            v-if="isLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></span>
          {{ isLoading ? "Prisijungiama..." : "Prisijungti" }}
        </button>
      </form>
    </div>
  </div>
</template>
