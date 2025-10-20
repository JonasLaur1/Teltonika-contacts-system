<script setup lang="ts">
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";
import ListRow from "@/components/ListRow.vue";
import EditCompany from "@/components/forms/EditCompany.vue";
import DeleteForm from "@/components/forms/DeleteForm.vue";
import Modal from "@/components/Modal.vue";
import Pagination from "@/components/Pagination.vue";
import PlusButton from "@/components/PlusButton.vue";
import type Company from "@/types/Companies";
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import ContactListEmpty from "@/components/ContactListEmpty.vue";
import companiesService from "@/services/companiesService";

const notificationstore = useNotificationStore();
const authStore = useAuthStore();

const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = ref<number>(1);
const modalState = ref(false);
const selectedCompany = ref<Company | null>(null);
const foundTotal = ref(0);
const companies = ref<Company[]>([]);
const createNew = ref(false);
const deleteForm = ref(false);

const getCompanies = async () => {
  try {
    const response = await companiesService.getCompanies(
      currentPage.value,
      itemsPerPage
    );
    companies.value = response.items;
    totalPages.value = Math.ceil(response.totalItems / itemsPerPage);
    foundTotal.value = response.totalItems;
  } catch (error) {
    notificationstore.addErrorNotification(
      "Klaida kraunant įmones. Bandykite dar kartą."
    );
  }
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  getCompanies();
};

const openModal = () => {
  modalState.value = !modalState.value;
  if (!modalState.value) {
    selectedCompany.value = null;
    createNew.value = false;
    deleteForm.value = false;
  }
};

const handleEditCompany = (company: Company) => {
  if (!authStore.userPermissions.canEditCompanies) {
    notificationstore.addAlertNotification(
      "Neturite reikalingų teisių, kad įvykdyti šį veiksmą."
    );
    return;
  }
  selectedCompany.value = company;
  deleteForm.value = false;
  createNew.value = false;
  modalState.value = true;
};

const handleCreateCompany = () => {
  if (!authStore.userPermissions.canEditCompanies) {
    notificationstore.addAlertNotification(
      "Neturite reikalingų teisių, kad įvykdyti šį veiksmą."
    );
    return;
  }
  selectedCompany.value = null;
  createNew.value = true;
  modalState.value = true;
};

const handleDeleteCompany = (company: Company) => {
  if (!authStore.userPermissions.canDeleteCompanies) {
    notificationstore.addAlertNotification(
      "Neturite reikalingų teisių, kad įvykdyti šį veiksmą."
    );
    return;
  }
  selectedCompany.value = company;
  deleteForm.value = true;
  modalState.value = true;
};

const handleUpdate = () => {
  selectedCompany.value = null;
  createNew.value = false;
  deleteForm.value = false;
  openModal();
  getCompanies();
};

onMounted(getCompanies);
</script>

<template>
  <Modal
    :modalState="modalState"
    @closeModal="openModal"
    :deleteForm="deleteForm"
  >
    <EditCompany
      v-if="!deleteForm"
      :company="selectedCompany"
      @updatedName="handleUpdate"
      :createNew="createNew"
    />
    <DeleteForm
      v-else
      :item="selectedCompany"
      :config="{ entityType: 'company' }"
      @closeModal="openModal"
      @itemDeleted="handleUpdate"
    />
  </Modal>
  <div class="ml-10 mr-10">
    <h1 class="text-3xl font-light my-5">Įmonės</h1>
    <div
      class="flex justify-start items-center gap-8"
      v-if="authStore.userPermissions.canEditCompanies"
    >
      <PlusButton @click="handleCreateCompany" />
      <p>Pridėti naują įmonę</p>
    </div>
    <p class="my-5">
      Iš viso rasta <span class="font-bold">{{ foundTotal }} įmonių</span>
    </p>
    <ContactListEmpty
      v-if="companies.length === 0"
      :message="'Įmonių sąrašas tuščias'"
    />
    <table v-else class="w-full shadow my-8 rounded-md">
      <CompaniesListHeader
        :columns="[
          { key: 'name', label: 'Pavadinimas' },
          { key: 'actions', label: 'Veiksmas' },
        ]"
      />
      <tbody>
        <ListRow
          v-for="company in companies"
          :key="company.id"
          :item="company"
          :columns="[
            { key: 'name', label: 'Pavadinimas' },
            { key: 'actions', label: 'Veiksmas' },
          ]"
          @editItem="handleEditCompany"
          @deleteItem="handleDeleteCompany"
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
