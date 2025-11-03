<script lang="ts" setup>
import adminService from "@/services/adminService";

const props = defineProps<{
  item: User;
}>();

const handleDelete = async() =>{
  try{
    const response = await adminService.deleteAdmin(props.item.id)

  }catch(error){
    console.log(error)
  }
}

</script>

<template>
  <div class="flex flex-col gap-6 p-6">
    <h1 class="text-3xl font-semibold">Ar tikrai norite ištrinti paskyrą?</h1>
    <p>Paskyros vardas: {{ item.username }}</p>
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
        {{ isLoading ? "Trinama..." : "Taip" }}
      </button>
    </div>
  </div>
</template>
