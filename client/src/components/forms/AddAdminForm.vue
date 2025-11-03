<script setup lang="ts">
import adminService from "@/services/adminService";
import { trimText } from "@/utils/textTrimming";
import { computed, onMounted, ref } from "vue";
import { validateName, validateEmail } from "@/utils/Validations";
import { permissionCategories } from "@/constants/permissions";
import type User from "@/types/User";

const isLoading = ref(false);
const name = ref("");
const email = ref("");
const selectedFile = ref<File | null>(null);
const currentAvatar = ref<string | null>(null);
const errors = ref<Record<string, string>>({});

const props = defineProps<{
  mode: "create" | "edit";
  admin?: User | null;
}>();

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

const emit = defineEmits<{
  (e: "createdAdmin", password: string): void;
  (e: "updated"): void
}>();

const buttonText = computed(() => {
  return selectedFile.value ? "Pakeisti nuotrauką" : "Įkelti nuotrauką";
});

const hasAnyPermission = computed(() =>
  Object.values(permissions.value).some((val) => val)
);

const validateForm = (): boolean => {
  errors.value = {};

  const nameError = validateName(name.value);
  if (nameError) errors.value.name = nameError;

  const emailError = validateEmail(email.value);
  if (emailError) errors.value.email = emailError;

  if (props.mode === 'create' && !hasAnyPermission.value) {
    errors.value.permissions = "Pasirinkite bent vieną leidimą";
  }

  return Object.keys(errors.value).length === 0;
};

const canSubmit = computed(() => {
  const basicValid = validateName(name.value) === "" && validateEmail(email.value) === "";
  return !isLoading.value && basicValid && (props.mode === "edit" || hasAnyPermission.value);
});

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFile.value = target.files?.[0] ?? null;
  if (target) target.value = "";
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  try {
    if (props.mode === "create") {
      const response = await adminService.addPermissions(permissions.value);

      const adminData = {
        username: trimText(name.value),
        email: trimText(email.value),
        password: "AdminTest123!",
        passwordConfirm: "AdminTest123!",
        permissions_id: response.id,
        avatar: selectedFile.value,
      };

      const result = await adminService.addAdmin(adminData);
      emit("createdAdmin", adminData.password);
    } else if (props.mode === "edit" && props.admin) {
      // Edit admin (name, email, avatar)
      const adminData = {
        username: trimText(name.value),
        email: trimText(email.value),
        avatar: selectedFile.value,
      };
      await adminService.updateAdmin(props.admin.id, adminData);
      emit("updated");
    }
  } catch (error) {
    console.log(error);
  }
};

  onMounted(() => {
    if (props.mode === "edit" && props.admin) {
      name.value = props.admin.username;
      email.value = props.admin.email;
      currentAvatar.value = props.admin.avatar
    }
  });

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
                  @input="errors.email = ''"
                  @blur="errors.email = validateEmail(email)"
                  :class="[
                    'w-full bg-[#F1F2F4] pl-12 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 transition-colors',
                    errors.email
                      ? 'border-2 border-red-500 focus:ring-red-500'
                      : 'border border-gray-300 focus:ring-blue-500',
                  ]"
                />
              </div>
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label for="file-upload" class="cursor-pointer inline-block">
                <span
                  class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  {{ buttonText }}
                </span>
              </label>
              <p v-if="!selectedFile && !currentAvatar" class="text-gray-500 text-sm mt-2">
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

          <div v-if="mode === 'create'" class="space-y-4 min-w-[300px]">
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
                      >{{ permission.label }}</span
                    >
                  </label>
                </div>
              </div>
              <p v-if="errors.permissions" class="text-red-500 text-sm mt-2">
                {{ errors.permissions }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end pt-4">
        <button
          type="submit"
          :disabled="isLoading || !canSubmit"
          class="w-1/3 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading">Kuriama...</span>
          <span v-else>Sukurti admin paskyrą</span>
        </button>
      </div>
    </form>
  </div>
</template>
