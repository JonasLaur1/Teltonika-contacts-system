<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'change', tab: string): void
}>()

const tabs = ['Ofisai', 'Padaliniai', 'Skyriai', 'Grupės']
const activeTab = ref(tabs[0])

const selectTab = (tab: string) => {
  activeTab.value = tab
  emit('change', tab)
}
</script>

<template>
  <div class="flex flex-wrap gap-4 my-5">
    <button
      v-for="tab in tabs"
      :key="tab"
      @click="selectTab(tab)"
      :class="[
        'sm:px-14 py-2 rounded-xl border transition-colors duration-200',
        activeTab === tab
          ? 'bg-white text-[#0054A6] border-[#0054A6]'
          : 'bg-[#0054A6] text-white hover:bg-[#1F3F77]'
      ]"
    >
      {{ tab }}
    </button>
  </div>
</template>
