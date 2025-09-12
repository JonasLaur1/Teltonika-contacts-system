import AdminManagementView from "@/views/AdminManagementView.vue";
import CompaniesManagementView from "@/views/CompaniesManagementView.vue";
import DetailedContactView from "@/views/DetailedContactView.vue";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import ResetPasswordView from "@/views/ResetPasswordView.vue";
import StructureManagementView from "@/views/StructureManagementView.vue";
import { createRouter, createWebHistory } from "vue-router";

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
    },
    {
      path: "/structure-management",
      name: "structure-management",
      component: StructureManagementView,
    },
    {
      path: "/companies-management",
      name: "companies-management",
      component: CompaniesManagementView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFoundView,
    }
  ],
});

export default router;
