<script setup lang="ts">
import employeeService from "@/services/employeeService";
import type Employee from "@/types/Employee";
import { useRoute, useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { getEmployeePhoto } from "@/utils/photoUtils";
import { useNotificationStore } from "@/stores/NotificationStore";

const route = useRoute();
const router = useRouter()
const employeeId = String(route.params.id);
const employee = ref<Employee>();
const notificationStore = useNotificationStore()
async function loadEmployee() {
  try {
    employee.value = await employeeService.getEmployeeById(employeeId);
  } catch (error: any) {
      if (error.status === 404) {
      router.push({ name: 'NotFound' });
          notificationStore.addErrorNotification("Kontaktas nerastas.")
      return;
    }
    notificationStore.addErrorNotification("Klaida kraunant kontaktus: " + error)
  }
}

const goHomePage = () => {
  router.push('/');
};

onMounted(() => {
  loadEmployee();
});
</script>

<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-5xl font-normal mb-6">Detalesnė kontakto informacija:</h1>
      <button
        class="shadow shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-100"
        @click="goHomePage"
      >
        <img
          src="../assets/images/back.svg"
          alt="Grįžti atgal"
          class="w-6 h-6"
        />
      </button>
    </div>

    <div v-if="employee" class="flex items-center gap-4 mb-8">
      <img
        :src="getEmployeePhoto(employee)"
        alt="Profile"
        class="w-16 h-16 rounded-full"
      />
      <div>
        <p class="text-2xl font-normal">
          {{ employee?.name }} {{ employee?.surname }}
        </p>
        <p class="text-xl text-gray-600">
          Pozicija: {{ employee.position }}
        </p>
      </div>
    </div>

    <div class="shadow shadow-xl rounded-lg p-6 grid grid-cols-2 gap-8 overflow-hidden">
      <div>
        <h2 class="text-3xl font-normal mb-4">Kontaktakinės detalės:</h2>
        <p class="labels">
          Elektroninis paštas:
          <a
            :href="`mailto:${employee?.email}`"
            class="text-blue-600 hover:underline"
          >
            {{ employee?.email }}
          </a>
        </p>
        <p class="labels">
          Telefono numeris:
          <a
            :href="`tel:${employee?.phone_number}`"
            class="text-blue-600 hover:underline"
          >
            {{ employee?.phone_number ?? "-" }}
          </a>
        </p>
      </div>

      <div>
        <h2 class="text-3xl font-normal mb-4">Kompanijos detalės:</h2>
        <p class="labels">
          Kompanija:
          {{
            employee?.expand?.company_id?.name
          }}
        </p>
        <p class="labels">
          Būstinė:
          {{
            employee?.expand?.office_id?.name
          }}
        </p>
        <p class="labels">
          Padalinys:
          {{
            employee?.expand?.division_id?.name
          }}
        </p>
        <p class="labels">
          Skyrius:
          {{
            employee?.expand?.department_id?.name ?? "-"
          }}
        </p>
        <p class="labels">
          Grupė:
          {{
            employee?.expand?.group_id?.name ?? "-"
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.labels {
  font-weight: 300;
  font-size: large;
  margin-bottom: 1rem;
}
</style>
