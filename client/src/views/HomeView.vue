<script setup lang="ts">
import { useNotificationStore } from "@/stores/NotificationStore";
import { onMounted, reactive, ref, watch } from "vue";
import SearchBar from "@/components/SearchBar.vue";
import Filters from "@/components/Filters.vue";
import ContactGrid from "@/components/ContactGrid.vue";
import ContactList from "@/components/ContactList.vue";
import employeeService from "@/services/employeeService";
import type Employee from "@/types/Employee";
import Pagination from "@/components/Pagination.vue";
import PerPageSelector from "@/components/PerPageSelector.vue";
import DisplayTypeToggle from "@/components/DisplayTypeToggle.vue";
import Loader from "@/components/Loader.vue";
import PlusButton from "@/components/PlusButton.vue";
import Modal from "@/components/Modal.vue";
import DeleteContactForm from "@/components/forms/DeleteContactForm.vue";
import CreateContactForm from "@/components/forms/CreateContactForm.vue";

type DisplayStyle = "grid" | "list";

const notificationStore = useNotificationStore();
const modalState = ref(false);
const searchQuery = ref("");
const displayType = ref<DisplayStyle>("grid");
const employees = ref<Employee[]>([]);
const totalItems = ref(0);
const currentPage = ref(1);
const itemsPerPage = ref<number | "All">(25);
const totalPages = ref<number>(1);
const createForm = ref(false);
const editForm = ref(false);
const deleteForm = ref(false);
const selectedEmployee = ref<Employee | null>(null);

const filters = reactive<{
  company: string | null;
  office: string | null;
  division: string | null;
  department: string | null;
  group: string | null;
}>({
  company: null,
  office: null,
  division: null,
  department: null,
  group: null,
});

const sentinel = ref<HTMLElement | null>(null);
const isLoading = ref(false);
const isLazyLoading = ref(false);
const optionsPerPage: (number | "All")[] = [5, 10, 25, 50, 100, "All"];

async function getEmployees(append = false) {
  try {
    if (append) {
      isLazyLoading.value = true;
    } else {
      isLoading.value = true;
    }

    const [records, newCurrentPage] = await employeeService.getEmployees(
      currentPage.value,
      itemsPerPage.value === "All" ? 50 : itemsPerPage.value,
      searchQuery.value,
      filters
    );

    if (append) {
      employees.value.push(...records.items);
    } else {
      employees.value = records.items;
    }

    currentPage.value = newCurrentPage;
    totalPages.value = records.totalPages;
    totalItems.value = records.totalItems;

    if (append) {
      isLazyLoading.value = false;
    } else {
      isLoading.value = false;
    }
  } catch (error) {
    isLoading.value = false;
    isLazyLoading.value = false;
    notificationStore.addErrorNotification(
      "Klaida kraunant kontaktus. Bandykite dar kartą."
    );
  }
}

const loadMore = async () => {
  if (
    isLoading.value ||
    isLazyLoading.value ||
    currentPage.value >= totalPages.value
  )
    return;
  currentPage.value += 1;
  await getEmployees(true);
};

const handlePerPageChange = (newPerPage: number | "All") => {
  itemsPerPage.value = newPerPage;
  currentPage.value = 1;
  employees.value = [];
  getEmployees();
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  getEmployees();
};

const handleSearchQuery = (value: string) => {
  currentPage.value = 1;
  employees.value = [];
  searchQuery.value = value;
  getEmployees();
};

const handleFiltersChanged = (newFilters: typeof filters) => {
  Object.assign(filters, newFilters);
  currentPage.value = 1;
  employees.value = [];
  getEmployees();
};

const toggleDisplayType = () => {
  displayType.value = displayType.value === "grid" ? "list" : "grid";
};

const handleCreateEmployee = () => {
  createForm.value = true;
  openModal();
};

const handleEditEmployee = (employee: Employee) => {
  selectedEmployee.value = employee;
  editForm.value = true;
  openModal();
};

const handleDeleteEmployee = (employee: Employee) => {
  selectedEmployee.value = employee;
  deleteForm.value = true;
  openModal();
};

const resetModalState = () => {
  getEmployees();
  selectedEmployee.value = null;
  createForm.value = false;
  editForm.value = false;
  deleteForm.value = false;
  modalState.value = false;
};

const openModal = () => {
  modalState.value = !modalState.value;
  if (!modalState.value) {
    resetModalState();
  }
};

onMounted(async () => {
  await getEmployees();

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        itemsPerPage.value === "All" &&
        !isLoading.value &&
        !isLazyLoading.value &&
        employees.value.length > 0
      ) {
        loadMore();
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    }
  );

  watch(
    sentinel,
    (el) => {
      if (el && itemsPerPage.value === "All") {
        setTimeout(() => observer.observe(el), 300);
      }
    },
    { immediate: true }
  );
});
</script>

<template>
  <Modal
    :modalState="modalState"
    @closeModal="openModal"
    :deleteForm="deleteForm"
  >
    <CreateContactForm
      v-if="createForm"
      mode="create"
      @created="resetModalState"
    />

    <CreateContactForm
      v-if="editForm"
      mode="edit"
      :employee="selectedEmployee"
      @updated="resetModalState"
    />

    <DeleteContactForm
      v-if="deleteForm"
      :employee="selectedEmployee"
      @closeModal="resetModalState"
    />
  </Modal>

  <div class="ml-10 mr-10">
    <h1 class="text-3xl font-light my-5">Kontaktų sistema</h1>

    <div class="flex gap-4 mb-5">
      <SearchBar @searchingQuery="handleSearchQuery" />

      <PerPageSelector
        :currentValue="itemsPerPage"
        :options="optionsPerPage"
        @change="handlePerPageChange"
      />

      <DisplayTypeToggle
        :currentType="displayType"
        @toggle="toggleDisplayType"
      />

      <PlusButton :size="10" @createCompany="handleCreateEmployee" />
    </div>

    <p class="my-5">
      Iš viso rasta: <span class="font-bold">{{ totalItems }} kontaktų</span>
    </p>
    <Filters @filtersChanged="handleFiltersChanged" />

    <ContactGrid
      v-if="displayType === 'grid' && !isLoading"
      :employees="employees"
      :isLoading="isLoading"
      @edit="handleEditEmployee"
      @delete="handleDeleteEmployee"
    />
    <ContactList
      v-else-if="!isLoading"
      :employees="employees"
      :isLoading="isLoading"
      @edit="handleEditEmployee"
      @delete="handleDeleteEmployee"
    />
    <Loader v-else />

    <div
      v-if="itemsPerPage === 'All'"
      ref="sentinel"
      class="h-10 flex justify-center items-center"
    >
      <span v-if="isLazyLoading">Kraunama...</span>
    </div>

    <Pagination
      v-else
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="handlePageChange($event)"
    />
  </div>
</template>
