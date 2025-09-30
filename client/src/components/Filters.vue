<script setup lang="ts">
import structureService from "@/services/structureService";
import type Company from "@/types/Companies";
import type Department from "@/types/Department";
import type Division from "@/types/Division";
import type Group from "@/types/Group";
import type Office from "@/types/Office";
import { ref, onMounted } from "vue";
import FilterSelect from "./FilterSelect.vue";

const companiesFilter = ref<Company[]>([]);
const officesFilter = ref<Office[]>([]);
const divisionsFilter = ref<Division[]>([]);
const departmentsFilter = ref<Department[]>([]);
const groupsFilter = ref<Group[]>([]);

const selectedCompanyFilter = ref<string | null>(null);
const selectedOfficeFilter = ref<string | null>(null);
const selectedDivisionFilter = ref<string | null>(null);
const selectedDepartmentFilter = ref<string | null>(null);
const selectedGroupFilter = ref<string | null>(null);

const emit = defineEmits<{
  filtersChanged: [
    filters: {
      company: string | null;
      office: string | null;
      division: string | null;
      department: string | null;
      group: string | null;
    }
  ];
}>();

function emitFilters() {
  emit("filtersChanged", {
    company: selectedCompanyFilter.value,
    office: selectedOfficeFilter.value,
    division: selectedDivisionFilter.value,
    department: selectedDepartmentFilter.value,
    group: selectedGroupFilter.value,
  });
}

async function getCompanies() {
  companiesFilter.value = await structureService.getCompanies();
}

async function onCompanyChange() {
  selectedOfficeFilter.value =
    selectedDivisionFilter.value =
    selectedDepartmentFilter.value =
    selectedGroupFilter.value =
      null;
  officesFilter.value =
    divisionsFilter.value =
    departmentsFilter.value =
    groupsFilter.value =
      [];
  if (selectedCompanyFilter.value) {
    officesFilter.value = await structureService.getLowerStructures(
      "companies",
      "companies_offices",
      selectedCompanyFilter.value,
      "company_id",
      "office_id"
    );
  }

  emitFilters();
}

async function onOfficeChange() {
  selectedDivisionFilter.value =
    selectedDepartmentFilter.value =
    selectedGroupFilter.value =
      null;
  divisionsFilter.value = departmentsFilter.value = groupsFilter.value = [];

  if (selectedOfficeFilter.value) {
    divisionsFilter.value = await structureService.getLowerStructures(
      "offices",
      "offices_divisions",
      selectedOfficeFilter.value,
      "office_id",
      "division_id"
    );
  }
  emitFilters();
}

async function onDivisionChange() {
  selectedDepartmentFilter.value = selectedGroupFilter.value = null;
  departmentsFilter.value = groupsFilter.value = [];

  if (selectedDivisionFilter.value) {
    try {
      departmentsFilter.value = await structureService.getLowerStructures(
        "divisions",
        "divisions_departments",
        selectedDivisionFilter.value,
        "division_id",
        "department_id"
      );
    } catch (error) {
      console.error("Error fetching lower structures:", error);
    }
  }
  emitFilters();
}

async function onDepartmentChange() {
  selectedGroupFilter.value = null;

  groupsFilter.value = [];
  if (selectedDepartmentFilter.value) {
    groupsFilter.value = await structureService.getLowerStructures(
      "groups",
      "departments_groups",
      selectedDepartmentFilter.value,
      "department_id",
      "group_id"
    );
  }
  emitFilters();
}

onMounted(() => {
  getCompanies();
});
</script>

<template>
  <div class="flex justify-start gap-4">
    <FilterSelect
      label="Įmonė"
      :items="companiesFilter"
      v-model="selectedCompanyFilter"
      placeholder="Filtruoti įmones..."
      :disabled="false"
      emptyMessage="Nėra įmonių..."
      @update:modelValue="onCompanyChange"
    />
    <FilterSelect
      label="Ofisas"
      :items="officesFilter"
      v-model="selectedOfficeFilter"
      placeholder="Filtruoti ofisus..."
      :disabled="!selectedCompanyFilter"
      emptyMessage="Nėra ofisų..."
      @update:modelValue="onOfficeChange"
    />
    <FilterSelect
      label="Padalinys"
      :items="divisionsFilter"
      v-model="selectedDivisionFilter"
      placeholder="Filtruoti padalinius..."
      :disabled="!selectedOfficeFilter"
      emptyMessage="Nėra padalinių..."
      @update:modelValue="onDivisionChange"
    />
    <FilterSelect
      label="Skyrius"
      :items="departmentsFilter"
      v-model="selectedDepartmentFilter"
      placeholder="Filtruoti skyrius..."
      :disabled="!selectedDivisionFilter"
      emptyMessage="Nėra skyrių..."
      @update:modelValue="onDepartmentChange"
    />
    <FilterSelect
      label="Grupė"
      :items="groupsFilter"
      v-model="selectedGroupFilter"
      placeholder="Filtruoti grupes..."
      :disabled="!selectedDepartmentFilter"
      emptyMessage="Nėra grupių..."
      @update:modelValue="emitFilters()"
    />
  </div>
</template>
