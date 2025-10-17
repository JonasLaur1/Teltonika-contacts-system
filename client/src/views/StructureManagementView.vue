<script setup lang="ts">
import { computed, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import PlusButton from "@/components/PlusButton.vue";
import StructureTabs from "@/components/StructureTabs.vue";
import CompaniesListHeader from "@/components/CompaniesListHeader.vue";
import structureService from "@/services/structureService";
const authStore = useAuthStore();
const currentTab = ref("Ofisai");
const items = ref<Array<Record<string, any>>>([]);

const columnsMap = {
  Ofisai: [
    { key: "name", label: "Pavadinimas" },
    { key: "address", label: "Adresas" },
    { key: "actions", label: "Veiksmas" },
  ],
  Kiti: [
    { key: "name", label: "Pavadinimas" },
    { key: "actions", label: "Veiksmas" },
  ],
};

const tabToCollectionMap: Record<string, string> = {
  Ofisai: 'offices',
  Padaliniai: 'departments',
  Skyriai: 'divisions',
  Grupės: 'groups',
};

const currentColumns = computed(() => {
  return currentTab.value === "Ofisai" ? columnsMap.Ofisai : columnsMap.Kiti;
});

const handleCreateStructure = () => {
  console.log(`Creating new ${currentTab.value}`);
};

const handleTabChange = (tab: string) => {
  currentTab.value = tab;
  console.log("Tab changed to:", tab);
};

const getStructureItems = async () => {
  const collectionName = tabToCollectionMap[currentTab.value];
  if (!collectionName) return;
  try {
    const result = await structureService.getStructures(collectionName, 1, 99999999);
    items.value = result.items
    console.log(items.value)
  } catch (error) {
    console.error("Failed to fetch structure items:", error);
  }
};


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
    <button class="button bg-blue-500 rounded" @click="getStructureItems">log</button>
    <table class="w-full shadow my-8 rounded-md">
      <CompaniesListHeader
        :columns="[
          { key: 'name', label: 'Pavadinimas' },
          { key: 'address', label: 'Adresas' },
          { key: 'actions', label: 'Veiksmas' },
        ]"
      />
      <tbody>
        <tr>
          <td class="px-6 py-4">Sample data</td>
          <td class="px-6 py-4">Sample address</td>
          <td class="px-6 py-4">Actions</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
