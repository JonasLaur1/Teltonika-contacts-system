<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter()


const goHomePage = () => {
  router.push('/');
};
</script>

<template>
<button class=" bg-gray-50 shadow shadow-xl rounded-full w-14 h-14 flex items-center justify-center hover:bg-gray-200" @click="goHomePage">
    <img
    src="../assets/images/back.svg"
    alt="Grįžti atgal"
    class="w-6 h-6"
    />
</button>
</template>