<script lang="ts" setup>
import structureService from "@/services/structureService";
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/AuthStore";
import { useNotificationStore } from "@/stores/NotificationStore";
import { validateName } from "@/utils/Validations";
import { trimText } from "@/utils/textTrimming";
import type Division from "@/types/Division";
import type Department from "@/types/Department";
import type Group from "@/types/Group";
import { STRUCTURE_FIELDS } from "@/constants/structureFields";
const props = defineProps<{
  structureType: "divisions" | "departments" | "groups";
  selectedItem: Division | Department | Group;
}>();

const isLoading = ref(false);
const parentStructures = ref<{ id?: string; name: string }[]>([]);
const selected = ref<string[]>([]);
const originalConnections = ref<string[]>([]);
const errors = ref<Record<string, string>>({});
const name = ref(props.selectedItem.name);
const originalName = props.selectedItem.name;

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const emit = defineEmits(["closeModal", "itemUpdated"]);

const config = computed(() => STRUCTURE_FIELDS[props.structureType]);

const isChanged = computed(() => {
  const nameChanged = name.value !== originalName;
  const selectionChanged = new Set(selected.value).size !== new Set(originalConnections.value).size
    || selected.value.some(id => !originalConnections.value.includes(id));
  return nameChanged || selectionChanged;
});

const loadExistingConnections = async () => {
  try {
    const connections = await structureService.getStructureConnections(
      config.value.linkTable,
      config.value.linkFields.parent,
      config.value.linkFields.child,
      props.selectedItem.id!
    );
    selected.value = [...connections];
    originalConnections.value = [...connections];
  } catch (error) {
    console.log("failed to load existing connections", error);
    notificationStore.addErrorNotification(
      "Nepavyko užkrauti susijusių įmonių"
    );
  }
};

const toggleSelection = (id: string) => {
  if (selected.value.includes(id)) {
    selected.value = selected.value.filter((i) => i !== id);
  } else {
    selected.value.push(id);
  }
  if (errors.value.parents) errors.value.parents = "";
};

const selectedCount = computed(() => selected.value.length);

const getParentStructures = async () => {
  try {
    const response = await structureService.getStructures(
      config.value.parentType,
      1,
      99999999
    );
    parentStructures.value = response.items.map((r: any) => ({
      id: r.id,
      name: r.name,
    }));
  } catch (error) {
    console.error(`Failed to load ${config.value.parentType}:`, error);
    notificationStore.addErrorNotification(
      `Nepavyko užkrauti ${config.value.parentType} sąrašo`
    );
  }
};

const validateForm = (): boolean => {
  errors.value = {};

  if (!name.value.trim()) {
    errors.value.name = "Šis laukas yra privalomas";
  } else {
    const validationError = validateName(name.value);
    if (validationError) errors.value.name = validationError;
  }

  if (selected.value.length === 0) {
    errors.value.parents = config.value.parentErrorMessage;
  }

  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!authStore.checkAuth()) return;
  if (!authStore.userPermissions.canEditStructures) {
    notificationStore.addErrorNotification(
      "Neturi reikiamų teisių šiam veiksmui."
    );
    return;
  }

  if (!validateForm()) return;
  if (isLoading.value) return;
  if (!isChanged.value) {
    notificationStore.addAlertNotification("Jokių pakeitimų nerasta.");
    return;
  }
  try {
    isLoading.value = true;

    const existing = await structureService.getStructures(
      props.structureType,
      1,
      1,
      trimText(name.value)
    );

    const duplicates = existing.items.filter(
      (item) => item.id !== props.selectedItem.id
    );

    if (duplicates.length > 0) {
      notificationStore.addErrorNotification(
        "Struktūra su tokiu pavadinimu jau egzistuoja"
      );
      return;
    }

    const toAdd = selected.value.filter(
      (id) => !originalConnections.value.includes(id)
    );
    const toRemove = originalConnections.value.filter(
      (id) => !selected.value.includes(id)
    );

    for (const companyId of toRemove) {
      await structureService.removeStructureConnection(config.value.linkTable, {
        [config.value.linkFields.child]: props.selectedItem.id!,
        [config.value.linkFields.parent]: companyId,
      });
    }

    for (const companyId of toAdd) {
      await structureService.linkStructures(config.value.linkTable, {
        [config.value.linkFields.parent]: companyId,
        [config.value.linkFields.child]: props.selectedItem.id,
      });
    }

    originalConnections.value = [...selected.value];

    const structureData = { name: trimText(name.value) };

    await structureService.updateStructure(
      props.structureType,
      props.selectedItem.id!,
      structureData
    );

    notificationStore.addSuccessNotification(config.value.successMessage);
    emit("itemUpdated");
  } catch (error: any) {
    console.error(`Failed to create ${props.structureType}:`, error);
    notificationStore.addErrorNotification(
      error.message || config.value.errorMessage
    );
  } finally {
    isLoading.value = false;
  }
};

const canSubmit = computed(() => {
  const hasNameFilled = name.value && name.value.trim() !== "";
  const hasParentSelected = selected.value.length > 0;
  return hasNameFilled && hasParentSelected && !isLoading.value;
});

onMounted(() => {
  getParentStructures();
  loadExistingConnections();
});
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">{{ config.title }}</h1>

    <form @submit.prevent="handleSubmit">
      <div class="flex gap-8">
        <div class="flex flex-col gap-4 flex-1">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ config.nameLabel }} *
            </label>
            <input
              v-model="name"
              type="text"
              :placeholder="config.namePlaceholder"
              @input="errors.name = ''"
              @blur="errors.name = validateName(name)"
              :class="[
                'w-full bg-[#F1F2F4] p-3 rounded-md focus:outline-none focus:ring-2 transition-colors',
                errors.name
                  ? 'border-2 border-red-500 focus:ring-red-500'
                  : 'border border-gray-300 focus:ring-blue-500',
              ]"
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">
              {{ errors.name }}
            </p>
          </div>
        </div>

        <div class="flex flex-col w-80">
          <label class="mb-3 font-medium text-gray-700">
            {{ config.parentLabel }} *
          </label>
          <div
            class="overflow-y-auto max-h-80 space-y-2 pr-2 border rounded-md p-3 bg-gray-50"
          >
            <button
              v-for="parent in parentStructures"
              :key="parent.id"
              type="button"
              @click="parent.id && toggleSelection(parent.id)"
              :class="[
                'w-full rounded-md py-3 px-4 text-left shadow-sm transition-all duration-200',
                selected.includes(parent.id!)
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200',
              ]"
            >
              {{ parent.name }}
            </button>
          </div>
          <p v-if="errors.parents" class="text-red-500 text-sm mt-1">
            {{ errors.parents }}
          </p>
          <p v-if="selectedCount > 0" class="text-sm text-gray-600 mt-2">
            {{ config.parentCountText(selectedCount) }}
          </p>
        </div>
      </div>

      <div class="flex justify-start gap-4 mt-8">
        <button
          type="submit"
          :disabled="!canSubmit"
          class="px-8 py-3 bg-[#0054A6] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
        >
          <span
            v-if="isLoading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
          ></span>
          {{
            isLoading
              ? "Redaguojama..."
              : `Redaguoti ${
                  props.structureType === "divisions"
                    ? "padalinį"
                    : props.structureType === "departments"
                    ? "skyrių"
                    : "grupę"
                }`
          }}
        </button>
      </div>
    </form>
  </div>
</template>
