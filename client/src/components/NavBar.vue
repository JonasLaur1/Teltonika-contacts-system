<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore';
import { useRouter } from 'vue-router';
import userService from '@/services/userService';
import { ref, onMounted } from 'vue';
import { getEmployeePhoto } from '@/utils/photoUtils';
import ChangePassword from '@/components/forms/ChangePassword.vue'
import Modal from "@/components/Modal.vue";

const authStore = useAuthStore();
const router = useRouter();
const isAuthenticated = ref(false);
const dropdownOpen = ref(false);
const modalState = ref(false);

const checkAuth = () => {
  isAuthenticated.value = userService.userAuthenticated();
};

onMounted(() => {
  checkAuth();
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
  dropdownOpen.value = false;
};

const handleChangePassword = () => {
  modalState.value = true;
  dropdownOpen.value = false;
};

const closeModal = () => {
  modalState.value = false;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};
</script>

<template>
  <Modal v-if="modalState" :modalState="modalState" @closeModal="closeModal">
    <ChangePassword @close="closeModal"/>
  </Modal>
  <div class="m-0 bg-[#1F3F77] h-14 flex items-center px-6">
    <div class="flex-1 flex justify-center">
      <ul class="flex space-x-6 text-white" v-if="isAuthenticated">
        <li>
          <router-link to="/" class="hover:underline">Kontaktai</router-link>
        </li>
        <li>
          <router-link to="/companies-management" class="hover:underline">Įmonės</router-link>
        </li>
        <li>
          <router-link to="/structure-management" class="hover:underline">Struktūra</router-link>
        </li>
        <li>
          <router-link to="/admin-management" class="hover:underline">Paskyros</router-link>
        </li>
      </ul>
    </div>

    <div class="ml-auto relative">
      <div v-if="isAuthenticated" class="relative">
        <button 
          @click="toggleDropdown"
          class="flex items-center focus:outline-none hover:opacity-80 transition-opacity"
        >
          <img 
            :src="getEmployeePhoto(authStore.user, 'navbar')" 
            alt="profile"
            class="w-12 h-12 rounded-full object-cover cursor-pointer"
          >
        </button>

        <div 
          v-if="dropdownOpen"
          @click="closeDropdown"
          class="fixed inset-0 z-10"
        ></div>
        
        <div
          v-if="dropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20"
        >
          <button
            @click="handleChangePassword"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Pakeisti slaptažodį
          </button>
          <button
            @click="handleLogout"
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Atsijungti
          </button>
        </div>
      </div>

      <router-link 
        v-else
        to="/login" 
        class="text-white font-semibold hover:underline"
      >
        Prisijungti
      </router-link>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
}
</style>
