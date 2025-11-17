<script setup lang="ts">
import { useNotificationStore } from "@/stores/NotificationStore";

const notificationStore = useNotificationStore();
const notifications = notificationStore.notifications;
</script>

<template>
  <div class="fixed top-14 right-5 z-[9999] flex flex-col gap-3 max-w-md min-w-80">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="bg-white flex items-stretch rounded pr-4 shadow-xl min-h-12"
    >
      <span
        :class="[
          notification.type === 'success'
            ? 'bg-green-500'
            : notification.type === 'error'
            ? 'bg-red-500'
            : notification.type === 'alert'
            ? 'bg-yellow-500'
            : 'bg-gray-500',
          'w-3 min-h-12 rounded-l flex-shrink-0',
        ]"
      ></span>
      <div class="pl-2 flex-1 min-w-0 flex items-center">
        <span
          :class="[
            'text-lg font-sm break-words leading-relaxed whitespace-normal',
            notification.type === 'success'
              ? 'text-green-700'
              : notification.type === 'error'
              ? 'text-red-700'
              : notification.type === 'alert'
              ? 'text-yellow-700'
              : 'text-gray-700'
          ]"
        >
          {{ notification.message }}
        </span>
      </div>
      <button
        class="ml-auto text-gray-500 hover:text-gray-800 font-bold pl-2 flex-shrink-0"
        @click="notificationStore.removeNotification(notification.id!)"
      >
        ×
      </button>
    </div>
  </div>
</template>
