import { defineStore } from "pinia";
import userService from "@/services/userService";
import { ref, computed } from "vue";
import type User from "@/types/User";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(false);
  const user = ref<User | null>(null);
  const permissions = ref<Record<string, boolean>>({});
  const isAdmin = computed(() => user.value?.name === "Admin")

  const getUserPermissions = async () => {
    try {
      if (!user.value) return;
      const permissionRecord = await userService.getUserPermissions(
        user.value?.permissions_id
      );
      permissions.value = permissionRecord;
    } catch (error) {
      console.error("Failed to get permissions:", error);
      permissions.value = {};
    }
  };

  const userPermissions = computed(() => ({
    canDeleteCompanies: permissions.value.delete_companies || false,
    canDeleteEmployees: permissions.value.delete_employees || false,
    canDeleteOffices: permissions.value.delete_offices || false,
    canDeletePermissions: permissions.value.delete_permissions || false,
    canDeleteStructures: permissions.value.delete_structure || false,
    canEditCompanies: permissions.value.edit_companies || false,
    canEditEmployees: permissions.value.edit_employees || false,
    canEditOffices: permissions.value.edit_offices || false,
    canEditPermissions: permissions.value.edit_permissions || false,
    canEditStructures: permissions.value.edit_structure || false,
    canReadPermissions: permissions.value.read_permissions || false,
  }));

  const checkAuth = () => {
    const authStatus = userService.userAuthenticated();
    isAuthenticated.value = authStatus;

    if (authStatus) {
      user.value = userService.getCurrentUser();
      getUserPermissions();
    } else {
      logout()
    }

    return authStatus;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await userService.loginUser(email, password);
      isAuthenticated.value = true;
      user.value = response.record;
      await getUserPermissions();
      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    userService.logoutUser();
    isAuthenticated.value = false;
    user.value = null;
    permissions.value = {};
  };

  checkAuth();

  return {
    isAuthenticated,
    isAdmin,
    user,
    userPermissions,
    login,
    logout,
    checkAuth,
  };
});
