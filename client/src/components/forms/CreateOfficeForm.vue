<script setup lang="ts">
const errorMessage = false
const fields = [
  { key: "officeName", placeholder: "Įveskite ofiso pavadinimą..." },
  { key: "street", placeholder: "Įveskite gavės pavadinimą..." },
  { key: "streetNumber", placeholder: "Įveskite pastato numerį..." },
  { key: "city", placeholder: "Įveskite miestą..." },
  { key: "country", placeholder: "Įveskite šalį..." },
];
</script>

<template>
  <div class="flex flex-col gap-4 p-6">
    <h1 class="text-3xl">Pridėkite naują ofisą:</h1>
    <div class="flex justify-between">
      <div class="flex flex-col gap-6">
        <input
          v-for="field in fields"
          :key="field.key"
          type="text"
          :placeholder="field.placeholder"
          :class="[
            'bg-[#F1F2F4] p-2 rounded focus:outline-none focus:ring-2',
            errorMessage
              ? 'border-2 border-red-500 focus:ring-red-500'
              : 'border border-gray-300 focus:ring-blue-500',
          ]"
        />
      </div>
      <div>
        <p>Įmonės:</p>
      </div>
    </div>
    <button class="button bg-[#0054A6] w-1/2 p-4 rounded-lg">Pridėti</button>
  </div>
</template>
