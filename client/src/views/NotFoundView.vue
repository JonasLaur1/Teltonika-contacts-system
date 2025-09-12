<script setup lang="ts"></script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
    <h1 class="text-9xl font-extrabold text-[#1F3F77]">404</h1>
    <p class="text-xl mt-4">Puslapis nerastas</p>
    <router-link 
      to="/" 
      class="mt-6 px-6 py-3 bg-[#1F3F77] text-white rounded-2xl shadow hover:bg-[#16325b] transition"
    >
      Go Home
    </router-link>
  </div>
</template>