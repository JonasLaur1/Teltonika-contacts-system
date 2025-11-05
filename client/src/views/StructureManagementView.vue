<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import PlusButton from "@/components/PlusButton.vue";
import StructureTabs from "@/components/StructureTabs.vue";
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";
import structureService from "@/services/structureService";
import ListRow from "@/components/ListRow.vue";
import DeleteForm from "@/components/forms/DeleteForm.vue";
import Modal from "@/components/Modal.vue";
import CreateOfficeForm from "@/components/forms/CreateOfficeForm.vue";
import Pagination from "@/components/Pagination.vue";
import CreateStructureForm from "@/components/forms/CreateStructureForm.vue";
import EditOfficeForm from "@/components/forms/EditOfficeForm.vue";
import ContactListEmpty from "@/components/ContactListEmpty.vue";
import EditStructureForm from "@/components/forms/EditStructureForm.vue";

const authStore = useAuthStore();
const currentTab = ref("Ofisai");
const items = ref<Array<Record<string, any>>>([]);
const modalState = ref(false);
const selectedItem = ref<any>(null);
const deleteForm = ref(false);
const createForm = ref(false);
const editForm = ref(false);
const currentPage = ref(1);
const itemsPerPage = 5;
const totalPages = ref<number>(1);
const foundTotal = ref(0);

const columnsMap = {
  Ofisai: [
    { key: "pavadinimas", label: "Pavadinimas" },
    { key: "adresas", label: "Adresas" },
    { key: "actions", label: "Veiksmai" },
  ],
  Kiti: [
    { key: "pavadinimas", label: "Pavadinimas" },
    { key: "actions", label: "Veiksmai" },
  ],
};

const tabToCollectionMap: Record<string, string> = {
  Ofisai: "offices",
  Padaliniai: "divisions",
  Skyriai: "departments",
  Grupės: "groups",
};

const currentColumns = computed(() =>
  currentTab.value === "Ofisai" ? columnsMap.Ofisai : columnsMap.Kiti
);

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  getStructureItems();
};

const getStructureItems = async () => {
  const collectionName = tabToCollectionMap[currentTab.value];
  if (!collectionName) return;

  try {
    const result = await structureService.getStructures(
      collectionName,
      currentPage.value,
      itemsPerPage
    );

    totalPages.value = Math.ceil(result.totalItems / itemsPerPage);
    foundTotal.value = result.totalItems;

    if (result.items.length === 0 && currentPage.value > 1) {
      currentPage.value--;
      await getStructureItems();
      return;
    }

    items.value = result.items.map((s: any) => ({
      ...s,
      pavadinimas: s.name,
      adresas: [s.street, s.street_number, s.city, s.country]
        .filter(Boolean)
        .join(", "),
    }));

    console.log("Loaded structures:", items.value);
  } catch (error) {
    console.error("Failed to fetch structure items:", error);
  }
};

const handleEditStructure = (item: any) => {
  selectedItem.value = item;
  editForm.value = true;
  modalState.value = true;
};

const handlePageChange = (newPage: number) => {
  currentPage.value = newPage;
  getStructureItems();
};

const resetModalState = () => {
  selectedItem.value = null;
  deleteForm.value = false;
  editForm.value = false;
  createForm.value = false;
  modalState.value = false;
};

const openModal = () => {
  modalState.value = !modalState.value;
  if (!modalState.value) {
    resetModalState()
  }
};

const handleDeleteStructure = (item: any) => {
  selectedItem.value = item;
  deleteForm.value = true;
  modalState.value = true;
};

const handleCreateStructure = (item: any) => {
  selectedItem.value = item;
  deleteForm.value = false;
  createForm.value = true;
  modalState.value = true;
};

const handleUpdate = () => {
  resetModalState()
  getStructureItems();
};

onMounted(() => {
  getStructureItems();
});
</script>

<template>
  <Modal
    :modalState="modalState"
    @closeModal="openModal"
    :deleteForm="deleteForm"
  >
    <DeleteForm
      v-if="deleteForm"
      :item="selectedItem"
      :config="{ 
        entityType: currentTab === 'Ofisai' ? 'office' : 'structure',
        structureType: tabToCollectionMap[currentTab].toLowerCase() as any,
        checkLowerStructures: currentTab !== 'Grupės'
      }"
      @closeModal="openModal"
      @itemDeleted="handleUpdate"
    />
    <CreateOfficeForm
      v-if="createForm && currentTab === 'Ofisai'"
      :item="selectedItem"
      @closeModal="openModal"
      @officeCreated="handleUpdate"
    />
    <CreateStructureForm
      v-if="createForm && currentTab !== 'Ofisai'"
      :structureType="tabToCollectionMap[currentTab] as 'divisions' | 'departments' | 'groups'"
      @closeModal="openModal"
      @itemCreated="handleUpdate"
    />
    <EditOfficeForm
      v-if="editForm && currentTab === 'Ofisai'"
      :selectedOffice="selectedItem"
      @closeModal="openModal"
      @officeUpdated="handleUpdate"
    />
    <EditStructureForm
      v-if="editForm && currentTab !== 'Ofisai'"
      :structureType="tabToCollectionMap[currentTab] as 'divisions' | 'departments' | 'groups'"
      :selectedItem="selectedItem"
      @closeModal="openModal"
      @itemUpdated="handleUpdate"
    />
  </Modal>
  <div class="ml-10 mr-10">
    <h1 class="text-3xl font-light my-5">Struktūra</h1>

    <div
      class="flex justify-start items-center gap-8"
      v-if="authStore.userPermissions.canEditCompanies"
    >
      <PlusButton @click="handleCreateStructure" />
      <p>Pridėti naują struktūrą</p>
    </div>

    <StructureTabs @change="handleTabChange" />
    <ContactListEmpty
      v-if="items.length === 0"
      :message="`Struktūros sąrašas tusčias`"
    />
    <table v-else class="w-full shadow my-8 rounded-md border border-gray-200">
      <CompaniesListHeader :columns="currentColumns" />

      <tbody>
        <ListRow
          v-for="item in items"
          :key="item.id"
          :item="item"
          :columns="currentColumns"
          :itemType="currentTab === 'Ofisai' ? 'office' : 'structure'"
          @editItem="handleEditStructure"
          @deleteItem="handleDeleteStructure"
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
