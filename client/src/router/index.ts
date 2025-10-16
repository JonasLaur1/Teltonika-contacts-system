import AdminManagementView from "@/views/AdminManagementView.vue";
import CompaniesManagementView from "@/views/CompaniesManagementView.vue";
import DetailedContactView from "@/views/DetailedContactView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import StructureManagementView from "@/views/StructureManagementView.vue";
import ConfirmPasswordResetView from "@/views/ConfirmPasswordResetView.vue";
import { createRouter, createWebHistory } from "vue-router";
import userService from "@/services/userService";
import { useAuthStore } from "@/stores/AuthStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      children: [
        {
          path: "",
          name: "home",
          component: HomeView,
          alias: ["/home"],
        },
        {
          path: "/home/:id",
          name: "detailed-contact",
          component: DetailedContactView,
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/password-reset",
      name: "password-reset",
      component: ResetPasswordView,
    },
    {
      path: "/admin-management",
      name: "admin-management",
      component: AdminManagementView,
      meta: { requiresAuth: true },
    },
    {
      path: "/structure-management",
      name: "structure-management",
      component: StructureManagementView,
      meta: { requiresAuth: true },
    },
    {
      path: "/companies-management",
      name: "companies-management",
      component: CompaniesManagementView,
      meta: { requiresAuth: true },
    },
    {
      path: "/confirm-password-reset/:token",
      name: "confirm-password-reset",
      component: ConfirmPasswordResetView,
      props: true,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = userService.userAuthenticated();
  const authStore = useAuthStore();

  if (requiresAuth && !isAuthenticated) {
    next("/login");
    return;
  }

  if (to.name === "login" && isAuthenticated) {
    next("/");
    return;
  }

  if (to.name === "admin-management") {
    if (!authStore.user) {
      await authStore.checkAuth();
    }
    
    if (!authStore.isAdmin) {
      next("/");
      return;
    }
  }

  next();
});

export default router;
