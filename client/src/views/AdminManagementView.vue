<script setup lang="ts">
import { useAuthStore } from "@/stores/AuthStore";
import PlusButton from "@/components/PlusButton.vue";
import { onMounted, ref } from "vue";
import adminService from "@/services/adminService";
import type User from "@/types/User";
import Pagination from "@/components/Pagination.vue";
import ListRow from "@/components/ListRow.vue";
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";


const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = ref<number>(1);
const foundTotal = ref(0);
const adminList = ref<User[]>([])
const authStore = useAuthStore();

const columnsMap = {
  Admin: [
    { key: "username", label: "Vardas" },
    { key: "email", label: "El. paštas" },
    { key: "actions", label: "Veiksmai" },
  ],
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  getAdmins();
};

const getAdmins = async() => {
    const response = await adminService.getAdmins(currentPage.value, itemsPerPage)
    adminList.value = response.items as User[]
    totalPages.value = response.totalPages
    foundTotal.value = response.totalItems
};

const handleEditAdmin = (admin: User) => {
  console.log("Edit admin:", admin);
};

const handleEditPermissions = (admin: User) => {
  console.log("Edit permissions:", admin.permissions_id);
};

const handleDeleteAdmin = (admin: User) => {
  console.log("Delete admin:", admin);
};
onMounted(() =>{
    getAdmins()
})
</script>

<template>
  <div class="ml-10 mr-10">
    <h1 class="text-3xl font-light my-5">Admin paskyros</h1>
    <div
      class="flex justify-start items-center gap-8"
      v-if="authStore.userPermissions.canEditPermissions"
    >
      <PlusButton />
      <p>Pridėti naują admin paskyrą</p>
    </div>
    <ContactListEmpty
      v-if="adminList.length === 0"
      :message="`Admin sąrašas tusčias`"
    />
    <table v-else class="w-full shadow my-8 rounded-md border border-gray-200">
      <CompaniesListHeader :columns="columnsMap.Admin" />

      <tbody>
        <ListRow
          v-for="admin in adminList"
          :key="admin.id"
          :item="admin"
          :itemType="'admin'"
          :columns="columnsMap.Admin"
          @editItem="handleEditAdmin"
          @deleteItem="handleDeleteAdmin"
          @editPermissions="handleEditPermissions"
        />
      </tbody>
    </table>
    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="handlePageChange($event)"
    />
  </div>
</template>
