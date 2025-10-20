<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import PlusButton from "@/components/PlusButton.vue";
import StructureTabs from "@/components/StructureTabs.vue";
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";
import structureService from "@/services/structureService";
import ListRow from "@/components/ListRow.vue";

const authStore = useAuthStore();
const currentTab = ref("Ofisai");
const items = ref<Array<Record<string, any>>>([]);

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
  Padaliniai: "departments",
  Skyriai: "divisions",
  Grupės: "groups",
};

const currentColumns = computed(() =>
  currentTab.value === "Ofisai" ? columnsMap.Ofisai : columnsMap.Kiti
);

const handleCreateStructure = () => {
  console.log(`Creating new ${currentTab.value}`);
};

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  getStructureItems();
};

const getStructureItems = async () => {
  const collectionName = tabToCollectionMap[currentTab.value];
  if (!collectionName) return;

  try {
    const result = await structureService.getStructures(collectionName, 1, 99999999);

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
  console.log("Editing structure item:", item);
};

const handleDeleteStructure = (item: any) => {
  console.log("Deleting structure item:", item);
};

onMounted(() => {
  getStructureItems()
})
</script>

<template>
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

    <table class="w-full shadow my-8 rounded-md border border-gray-200">
      <CompaniesListHeader :columns="currentColumns" />

      <tbody>
        <ListRow
          v-for="item in items"
          :key="item.id"
          :item="item"
          :columns="currentColumns"
          @editItem="handleEditStructure"
          @deleteItem="handleDeleteStructure"
        />
      </tbody>
    </table>
  </div>
</template>
