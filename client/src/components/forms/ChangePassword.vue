<script setup lang="ts">
import { ref } from "vue";
import passwordShowIcon from "@/assets/images/password-show.svg";
import passwordHideIcon from "@/assets/images/password-hide.svg";
import { validatePassword, validatePasswordConfirm } from "@/utils/Validations";
import { useAuthStore } from '@/stores/AuthStore.ts'
import userService from '@/services/userService.ts'
import { useNotificationStore } from "@/stores/NotificationStore";

const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const password = ref("");
const passwordConfirm = ref("");
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);
const passwordError = ref("");
const passwordConfirmError = ref("");
const isLoading = ref(false);

const validatePasswordField = () => {
  passwordError.value = validatePassword(password.value);
  return !passwordError.value;
};

const validatePasswordConfirmField = () => {
  passwordConfirmError.value = validatePasswordConfirm(
    password.value,
    passwordConfirm.value
  );
  return !passwordConfirmError.value;
};

const handlePasswordChange = async () => {
  const isPasswordValid = validatePasswordField();
  const isPasswordConfirmValid = validatePasswordConfirmField();
  
  if (!isPasswordValid || !isPasswordConfirmValid) {
    return;
  }

  if (!authStore.user || !authStore.checkAuth || !localStorage.getItem("pocketbase_auth")) {
    notificationStore.addErrorNotification('Prisijunkite prieš bandant keisti slaptažodį.');
    return;
  }

  try {
    isLoading.value = true
    
    const authResponse = await userService.passwordChange(
      authStore.user.id, 
      password.value, 
      passwordConfirm.value
    );
    
    authStore.user = authResponse.record;
    authStore.isAuthenticated = true;

    notificationStore.addSuccessNotification("Sėkmingai pakeistas slaptažodis")
    
    password.value = "";
    passwordConfirm.value = "";
    
  } catch (error) {
    notificationStore.addErrorNotification('Keičiant slaptažodį iškilo klaida. Bandykite dar kartą.');
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-semibold">Slaptažodžio keitimas</h1>
    <div class="flex flex-col justify-center items-center">
      <form
        @submit.prevent="handlePasswordChange"
        class="py-8 space-y-14 flex flex-col items-center"
      >
        <div class="space-y-2 w-7/8">
          <label for="password" class="block">Naujas slaptažodis:</label>
          <div class="relative">
            <img
              src="../../assets/images/password.svg"
              alt="Password icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
            />
            <button
              @click="passwordVisible = !passwordVisible"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer z-10 hover:opacity-70 transition-opacity"
            >
              <img
                :src="passwordVisible ? passwordHideIcon : passwordShowIcon"
                alt="Password visibility button"
              />
            </button>
            <input
              v-model="password"
              @input="passwordError = ''"
              @blur="validatePasswordField"
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              placeholder="Įveskite naują slaptažodį..."
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

        <div class="space-y-2 w-7/8">
          <label for="passwordConfirm" class="block"
            >Patvirtinkite slaptažodį:</label
          >
          <div class="relative">
            <img
              src="../../assets/images/password.svg"
              alt="Password icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
            />
            <button
              @click="passwordConfirmVisible = !passwordConfirmVisible"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer z-10 hover:opacity-70 transition-opacity"
            >
              <img
                :src="
                  passwordConfirmVisible ? passwordHideIcon : passwordShowIcon
                "
                alt="Password visibility button"
              />
            </button>
            <input
              v-model="passwordConfirm"
              @input="passwordConfirmError = ''"
              @blur="validatePasswordConfirmField"
              :type="passwordConfirmVisible ? 'text' : 'password'"
              id="passwordConfirm"
              placeholder="Pakartokite slaptažodį..."
              required
              :disabled="isLoading"
              :class="[
                'w-full bg-[#F1F2F4] pl-12 pr-12 py-3 rounded focus:outline-none focus:ring-2 disabled:opacity-50',
                passwordConfirmError
                  ? 'border-2 border-red-500 focus:ring-red-500'
                  : 'focus:ring-blue-500',
              ]"
            />
          </div>
          <div
            v-if="passwordConfirmError"
            class="text-red-500 text-sm mt-1 flex items-center"
          >
            {{ passwordConfirmError }}
          </div>
        </div>

        <button
          type="submit"
          :disabled="isLoading || !!passwordError || !!passwordConfirmError"
          class="w-1/2 bg-[#0054A6] text-white py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <span
            v-if="isLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></span>
          {{ isLoading ? "Keičiama..." : "Pakeisti slaptažodį" }}
        </button>
      </form>
    </div>
  </div>
</template>
