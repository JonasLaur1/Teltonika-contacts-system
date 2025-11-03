<script setup lang="ts">
import { permissionCategories } from "@/constants/permissions";
import adminService from "@/services/adminService";
import userService from "@/services/userService";
import type User from "@/types/User";
import { onMounted, ref } from "vue";

const errors = ref<Record<string, string>>({});
const isLoading = ref(false)
const props = defineProps<{
  admin: User | null;
}>();

const permissions = ref({
  edit_employees: false,
  delete_employees: false,
  edit_offices: false,
  delete_offices: false,
  edit_structure: false,
  delete_structure: false,
  read_permissions: false,
  edit_permissions: false,
  delete_permissions: false,
  edit_companies: false,
  delete_companies: false,
});

const emit = defineEmits<{
  updated: [];
}>();

const getAdminPermissions = async () => {
  if (!props.admin) return;
  
  try {
    isLoading.value = true
    const response = await userService.getUserPermissions(
      props.admin.permissions_id
    );

    Object.keys(permissions.value).forEach((key) => {
      permissions.value[key as keyof typeof permissions.value] =
        response[key] === true;
    });
  } catch (error) {
    console.log(error);
  } finally{
    isLoading.value = false
  }
};
const handleSubmit = async() => {
    try{
        const response = await adminService.updatePermissions(props.admin?.permissions_id!, permissions.value)
        console.log("Success")
        emit("updated")
    }catch(error){
        console.log(error)
    }
};
onMounted(() => {
  getAdminPermissions();
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Redaguoti paskyros teises:</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-5xl">
      <div>
        <p>Administracinės teisės:</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div
            v-for="category in permissionCategories"
            :key="category.title"
            class="space-y-2"
          >
            <div class="space-y-1 pl-2">
              <label
                v-for="permission in category.permissions"
                :key="permission.key"
                class="flex items-center space-x-3 cursor-pointer group py-1"
              >
                <input
                  v-model="permissions[permission.key as keyof typeof permissions]"
                  type="checkbox"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
                <span class="text-sm text-gray-700 group-hover:text-gray-900">
                  {{ permission.label }}
                </span>
              </label>
            </div>
          </div>
          <p v-if="errors.permissions" class="text-red-500 text-sm mt-2">
            {{ errors.permissions }}
          </p>
        </div>
      </div>
      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-1/3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Atnaujinama...</span>
          <span v-else>Atnaujinti</span>
        </button>
      </div>
    </form>
  </div>
</template>
