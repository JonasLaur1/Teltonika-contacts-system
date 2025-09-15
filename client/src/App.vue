<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import Notification from "./components/Notification.vue";
</script>

<template>
  <div class="h-screen overflow-hidden">
    <NavBar />
    <router-view />
    <Notification />
  </div>
</template>

<style scoped></style>
