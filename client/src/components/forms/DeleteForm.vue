<script setup lang="ts">
import structureService from "@/services/structureService";
import companiesService from "@/services/companiesService";
import { useNotificationStore } from "@/stores/NotificationStore";
import { ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";

interface DeleteConfig {
  entityType: 'company' | 'office' | 'structure';
  structureType?: 'offices' | 'departments' | 'divisions' | 'groups';
  checkLowerStructures?: boolean;
}

const props = defineProps<{
  item: any;
  config: DeleteConfig;
}>();

const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const emit = defineEmits(["closeModal", "itemDeleted"]);

const isLoading = ref(false);

const structureHierarchy: Record<string, { 
  lowerCollection: string;
  junctionTable: string;
  parentIdField: string;
  childIdField: string;
}> = {
  companies: {
    lowerCollection: "offices",
    junctionTable: "companies_offices",
    parentIdField: "company_id",
    childIdField: "office_id"
  },
  offices: {
    lowerCollection: "divisions",
    junctionTable: "offices_divisions",
    parentIdField: "office_id",
    childIdField: "division_id"
  },
  divisions: {
    lowerCollection: "departments",
    junctionTable: "divisions_departments",
    parentIdField: "division_id",
    childIdField: "department_id"
  },
  departments: {
    lowerCollection: "groups",
    junctionTable: "departments_groups",
    parentIdField: "department_id",
    childIdField: "group_id"
  }
};

const entityNames: Record<string, { singular: string; genitive: string }> = {
  company: { singular: "įmonę", genitive: "įmonės" },
  offices: { singular: "ofisą", genitive: "ofiso" },
  divisions: { singular: "padalinį", genitive: "padalinio" },
  departments: { singular: "skyrių", genitive: "skyriaus" },
  groups: { singular: "grupę", genitive: "grupės" }
};

const getEntityName = (type: string) => {
  if (type === 'company') return entityNames.company;
  return entityNames[props.config.structureType || ''] || { singular: 'įrašą', genitive: 'įrašo' };
};

const checkPermissions = () => {
  authStore.checkAuth();
  
  if (props.config.entityType === 'company') {
    if (!authStore.userPermissions.canDeleteCompanies) {
      notificationStore.addErrorNotification("Neturi reikiamų teisių, kad atlikti šį veiksmą.");
      return false;
    }
  } else if (props.config.entityType === 'office') {
    if (!authStore.userPermissions.canDeleteOffices) {
      notificationStore.addErrorNotification("Neturi reikiamų teisių, kad atlikti šį veiksmą.");
      return false;
    }
  } else {
    notificationStore.addErrorNotification("Neturi reikiamų teisių, kad atlikti šį veiksmą.");
    return false;
  }
  
  return true;
};

const checkForLowerStructures = async (collectionName: string): Promise<boolean> => {
  const hierarchyConfig = structureHierarchy[collectionName];
  
  if (!hierarchyConfig) return false;
  
  try {
    const lowerItems = await structureService.getLowerStructures(
      collectionName,
      hierarchyConfig.junctionTable,
      props.item.id,
      hierarchyConfig.parentIdField,
      hierarchyConfig.childIdField
    );
    
    return lowerItems.length > 0;
  } catch (error) {
    console.error("Error checking lower structures:", error);
    return false;
  }
};

const handleDelete = async () => {
  if (!props.item) return;
  if (!checkPermissions()) return;
  if (isLoading.value) return;

  try {
    isLoading.value = true;
    
    if (props.config.checkLowerStructures !== false && props.config.structureType !== 'groups') {
      const collectionName = props.config.entityType === 'company' 
        ? 'companies' 
        : props.config.structureType || '';
      
      const hasLowerStructures = await checkForLowerStructures(collectionName);
      
      if (hasLowerStructures) {
        const entityName = getEntityName(props.config.entityType);
        notificationStore.addAlertNotification(
          `Negalima ištrinti ${entityName.genitive}, kuri turi žemesnių struktūrų.`
        );
        emit("closeModal");
        return;
      }
    }

    if (props.config.entityType === 'company') {
      await companiesService.deleteCompany(props.item.id);
    } else {
      await structureService.deleteStructure(
        props.config.structureType || '',
        props.item.id
      );
    }
    
    const entityName = getEntityName(props.config.entityType);
    notificationStore.addSuccessNotification(
      `${entityName.singular.charAt(0).toUpperCase() + entityName.singular.slice(1)} buvo sėkmingai ištrinta.`
    );
    emit("itemDeleted");
  } catch (error) {
    const entityName = getEntityName(props.config.entityType);
    notificationStore.addErrorNotification(
      `Klaida bandant ištrinti ${entityName.singular}. Bandykite dar kartą.`
    );
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div v-if="item" class="flex flex-col gap-6">
    <h1 class="text-2xl font-semibold">
      Ar tikrai norite ištrinti {{ getEntityName(config.entityType).singular }}?
    </h1>
    <p class="text-xl text-gray-500">
      {{ getEntityName(config.entityType).genitive.charAt(0).toUpperCase() + getEntityName(config.entityType).genitive.slice(1) }} 
      pavadinimas: {{ item.name || item.pavadinimas }}
    </p>
    <div class="flex justify-end gap-6 text-[#0054A6] font-medium text-lg">
      <button 
        @click="emit('closeModal')"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors"
      >
        Ne
      </button>
      <button 
        @click="handleDelete"
        :disabled="isLoading"
        class="disabled:opacity-50 disabled:cursor-not-allowed hover:underline transition-colors flex items-center"
      >
        <span
          v-if="isLoading"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"
        ></span>
        {{ isLoading ? 'Trinama...' : 'Taip' }}
      </button>
    </div>
  </div>
</template>