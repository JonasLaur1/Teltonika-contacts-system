<script setup lang="ts">
import { useAuthStore } from "@/stores/AuthStore";
import PlusButton from "@/components/PlusButton.vue";
import { onMounted, ref } from "vue";
import adminService from "@/services/adminService";
import type User from "@/types/User";
import Pagination from "@/components/Pagination.vue";
import ListRow from "@/components/ListRow.vue";
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";
import Modal from "@/components/Modal.vue";
import AddAdminForm from "@/components/forms/AddAdminForm.vue";
import TempPasswordForm from "@/components/forms/TempPasswordForm.vue";
import DeleteAdminForm from "@/components/forms/DeleteAdminForm.vue";
import EditPermissionsForm from "@/components/forms/EditPermissionsForm.vue";
import ContactListEmpty from "@/components/ContactListEmpty.vue";

const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = ref<number>(1);
const foundTotal = ref(0);
const adminList = ref<User[]>([]);
const modalState = ref(false);
const deleteForm = ref(false);
const createForm = ref(false);
const tempPasswordForm = ref(false);
const editAdminForm = ref(false);
const editPermissionsForm = ref(false);
const selectedItem = ref<User | null>(null);
const tempPassword = ref("");
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

const getAdmins = async () => {
  const response = await adminService.getAdmins(
    currentPage.value,
    itemsPerPage
  );
  adminList.value = response.items as User[];
  totalPages.value = response.totalPages;
  foundTotal.value = response.totalItems;
};

const handleCreateAdmin = () => {
  createForm.value = true;
  openModal();
};

const handleTempPassword = (password: string) => {
  tempPassword.value = password;
  resetModalState();
  getAdmins();
  openModal();
  tempPasswordForm.value = true;
};

const handleEditAdmin = (admin: User) => {
  selectedItem.value = admin;
  editAdminForm.value = true;
  openModal()
};

const handleEditPermissions = (admin: User) => {
  selectedItem.value = admin;
  editPermissionsForm.value = true;
  openModal()
};

const handleDeleteAdmin = (admin: User) => {
  selectedItem.value = admin;
  deleteForm.value = true;
  openModal()
};

const resetModalState = () => {
  getAdmins()
  selectedItem.value = null;
  deleteForm.value = false;
  editAdminForm.value = false;
  editPermissionsForm.value = false;
  createForm.value = false;
  tempPasswordForm.value = false;
  modalState.value = false;
};

const openModal = () => {
  modalState.value = !modalState.value;
  if (!modalState.value) {
    resetModalState();
  }
};

onMounted(() => {
  getAdmins();
});
</script>

<template>
  <Modal
    :modalState="modalState"
    @closeModal="openModal"
    :deleteForm="deleteForm"
  >
    <AddAdminForm :mode="'create'" v-if="createForm" @createdAdmin="handleTempPassword" />
    <TempPasswordForm :password="tempPassword" v-if="tempPasswordForm" />
    <DeleteAdminForm :admin="selectedItem" v-if="deleteForm" @closeModal="resetModalState" />
    <EditPermissionsForm :admin="selectedItem" v-if="editPermissionsForm" @updated="resetModalState"/>
    <AddAdminForm :mode="'edit'" :admin="selectedItem" v-if="editAdminForm" @updated="resetModalState"/>
  </Modal>
  <div class="ml-10 mr-10">
    <h1 class="text-3xl font-light my-5">Admin paskyros</h1>
    <div
      class="flex justify-start items-center gap-8"
      v-if="authStore.userPermissions.canEditPermissions"
    >
      <PlusButton @createCompany="handleCreateAdmin" />
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
