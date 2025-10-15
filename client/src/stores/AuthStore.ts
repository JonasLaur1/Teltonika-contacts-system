import { defineStore } from "pinia";
import userService from "@/services/userService";
import { ref } from "vue";
import type User from "@/types/User";

export const useAuthStore = defineStore("auth", () => {
    const isAuthenticated = ref(false);
    const user = ref<User | null>(null);

    const checkAuth = () => {
        const authStatus = userService.userAuthenticated();
        isAuthenticated.value = authStatus;
        
        if (authStatus) {
            user.value = userService.getCurrentUser();
        } else {
            user.value = null;
        }
        
        return authStatus;
    };

    checkAuth();

    const login = async (email: string, password: string) => {
        try {
            const response = await userService.loginUser(email, password);
            isAuthenticated.value = true;
            user.value = response.record;
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const logout = () => {
        userService.logoutUser();
        isAuthenticated.value = false;
        user.value = null;
    };

    return {
        isAuthenticated,
        user,
        login,
        logout,
        checkAuth
    };
});