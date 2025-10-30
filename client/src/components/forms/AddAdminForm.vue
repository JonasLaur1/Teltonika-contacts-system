<script setup lang="ts">
import adminService from "@/services/adminService";
import { ref } from "vue";

const isLoading = ref(false);
const name = ref("");
const email = ref("");
const selectedFile = ref<File | null>(null);

const permissions = ref({
  edit_employees: false,
  delete_employees: false,
  edit_offices: false,
  delete_offices: false,
  edit_structure: false,
  delete_structure: false,
  read_permissions: false,
  edit_permissions: false,
  delete_permissions: false,
  edit_companies: false,
  delete_companies: false,
});

const permissionCategories = [
  {
    title: "Darbuotojai",
    permissions: [
      { key: "edit_employees", label: "Redaguoti ir kurti kontaktus" },
      { key: "delete_employees", label: "Šalinti kontaktus" },
    ],
  },
  {
    title: "Ofisai",
    permissions: [
      { key: "edit_offices", label: "Redaguoti ir kurti ofisus" },
      { key: "delete_offices", label: "Šalinti ofisus" },
    ],
  },
  {
    title: "Struktūra",
    permissions: [
      { key: "edit_structure", label: "Redaguoti ir kurti struktūrą" },
      { key: "delete_structure", label: "Šalinti struktūrą" },
    ],
  },
  {
    title: "Įmonės",
    permissions: [
      { key: "edit_companies", label: "Redaguoti ir kurti įmones" },
      { key: "delete_companies", label: "Šalinti įmones" },
    ],
  },
  {
    title: "Leidimai",
    permissions: [
      { key: "read_permissions", label: "Peržiūrėti leidimus" },
      { key: "edit_permissions", label: "Redaguoti leidimus" },
      { key: "delete_permissions", label: "Šalinti leidimus" },
    ],
  },
];

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
};

const handleSubmit = async () => {
  try {
    const response = await adminService.addPermissions(permissions.value);
    console.log(response);

    const adminData = {
      username: name.value,
      email: email.value,
      password: "AdminTest123!",
      passwordConfirm: "AdminTest123!",
      permissions_id: response.id,
      avatar: selectedFile.value,
    };

    const result = await adminService.addAdmin(adminData);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Pridėti naują admin paskyrą</h1>
    <form @submit.prevent="handleSubmit" class="space-y-6 max-w-5xl">
      <div>
        <div class="flex flex-row gap-6">
          <div class="flex flex-col gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Vardas:
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="Įveskite vardą..."
                class="w-full bg-[#F1F2F4] p-3 rounded-md focus:outline-none focus:ring-2 transition-colors border border-gray-300 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Elektroninis paštas:
              </label>
              <div class="relative">
                <img
                  src="../../assets/images/email.svg"
                  alt="Email icon"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none z-10"
                />
                <input
                  v-model="email"
                  type="email"
                  placeholder="Įveskite el. pašto adresą..."
                  class="w-full bg-[#F1F2F4] pl-12 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 transition-colors border border-gray-300 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label for="file-upload" class="cursor-pointer inline-block">
                <span
                  class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  ĮKELTI NUOTRAUKĄ
                </span>
              </label>
              <p v-if="!selectedFile" class="text-gray-500 text-sm mt-2">
                No photo uploaded.
              </p>
              <p v-else class="text-gray-500 text-sm mt-2">
                Photo has been uploaded.
              </p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="hidden"
              />
            </div>
          </div>

          <div class="space-y-4 min-w-[300px]">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">Leidimai</h3>
            </div>

            <div class="bg-gray-50 p-4 rounded-lg">
              <div
                v-for="category in permissionCategories"
                :key="category.title"
                class="space-y-2"
              >
                <div class="space-y-1 pl-2">
                  <label
                    v-for="permission in category.permissions"
                    :key="permission.key"
                    class="flex items-center space-x-3 cursor-pointer group py-1"
                  >
                    <input
                      v-model="permissions[permission.key as keyof typeof permissions]"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                    />
                    <span
                      class="text-sm text-gray-700 group-hover:text-gray-900"
                    >
                      {{ permission.label }}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-1/3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Kuriama...</span>
          <span v-else>Sukurti admin paskyrą</span>
        </button>
      </div>
    </form>
  </div>
</template>
