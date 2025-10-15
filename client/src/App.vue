<script setup lang="ts">
import NavBar from "./components/NavBar.vue";
import Notification from "./components/Notification.vue";
import { useRoute } from "vue-router";
import { computed } from "vue";

const route = useRoute()
const hideNavBar = ['/login', '/password-reset', '/confirm-password-reset']

const shouldShowNavbar = computed(() => {
  return !hideNavBar.some(path => route.path.startsWith(path))
})


</script>

<template>
  <div>
    <NavBar v-if="shouldShowNavbar"/>
    <router-view />
    <Notification />
  </div>
</template>

<style scoped></style>
