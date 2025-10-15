<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotificationStore } from "@/stores/NotificationStore";
import userService from "@/services/userService";
import BackButton from "@/components/BackButton.vue";
import passwordShowIcon from "../assets/images/password-show.svg";
import passwordHideIcon from "../assets/images/password-hide.svg";
import { validatePassword, validatePasswordConfirm } from '@/utils/Validations';

const route = useRoute();
const router = useRouter();
const notificationStore = useNotificationStore();

const isLoading = ref(false);
const password = ref("");
const passwordConfirm = ref("");
const token = ref("");
const passwordError = ref("");
const passwordConfirmError = ref("");
const passwordVisible = ref(false);
const passwordConfirmVisible = ref(false);

onMounted(() => {
  token.value = (route.params.token as string) || "";
  if (!token.value) {
    notificationStore.addErrorNotification("Neteisingas atkūrimo kodas");
    router.push("/login");
  }
});

const validatePasswordField = () => {
  passwordError.value = validatePassword(password.value);
  return !passwordError.value;
};

const validatePasswordConfirmField = () => {
  passwordConfirmError.value = validatePasswordConfirm(password.value, passwordConfirm.value);
  return !passwordConfirmError.value;
};

const handlePasswordReset = async () => {
  const isPasswordValid = validatePasswordField();
  const isPasswordConfirmValid = validatePasswordConfirmField();

  if (!isPasswordValid || !isPasswordConfirmValid) {
    return;
  }

  isLoading.value = true;

  try {
    await userService.confirmPasswordReset(
      token.value,
      password.value,
      passwordConfirm.value
    );
    notificationStore.addSuccessNotification("Slaptažodis sėkmingai pakeistas");
    router.push("/login");
  } catch (error: any) {
    notificationStore.addErrorNotification("Klaida keičiant slaptažodį. Bandykite dar kartą");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center items-center bg-[#1F3F77] h-screen">
    <div class="bg-white w-1/3 h-5/6 p-8 shadow-lg overflow-hidden">
      <h1 class="text-center text-5xl font-normal">Slaptažodžio atkūrimas</h1>
      <form
        @submit.prevent="handlePasswordReset"
        class="py-8 space-y-14 flex flex-col items-center"
      >
        <div class="space-y-2 w-2/3">
          <label for="password" class="block">Naujas slaptažodis:</label>
          <div class="relative">
            <img
              src="../assets/images/password.svg"
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

        <div class="space-y-2 w-2/3">
          <label for="passwordConfirm" class="block"
            >Patvirtinkite slaptažodį:</label
          >
          <div class="relative">
            <img
              src="../assets/images/password.svg"
              alt="Password icon"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
            />
            <button
              @click="passwordConfirmVisible = !passwordConfirmVisible"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer z-10 hover:opacity-70 transition-opacity"
            >
              <img
                :src="passwordConfirmVisible ? passwordHideIcon : passwordShowIcon"
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
