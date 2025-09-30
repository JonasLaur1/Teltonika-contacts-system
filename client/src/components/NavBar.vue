<script setup lang="ts">

</script>

<template>
  <div class="m-0 bg-[#1F3F77] h-14 flex items-center px-6">
    <div class="flex-1 flex justify-center">
      <ul class="flex space-x-6 text-white">
        <!-- <li>
          <router-link to="/">Kontaktai</router-link>
        </li>
        <li>
          <router-link to="/companies-management">Įmonės</router-link>
        </li>
        <li>
          <router-link to="/structure-management">Struktūra</router-link>
        </li>
        <li>
          <router-link to="/admin-management">Paskyros</router-link>
        </li> -->
      </ul>
    </div>

    <div class="ml-auto">
      <router-link to="/login" class="text-white font-semibold hover:underline">
        Prisijungti
      </router-link>
    </div>
  </div>
</template>

<style scoped>
body {
  margin: 0;
}
</style>
