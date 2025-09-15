import { defineStore } from "pinia";
import type Notification from "@/types/Notification";
import { ref, readonly } from "vue";

export const useNotificationStore = defineStore("notifications", () => {
  const notifications = ref<Notification[]>([]);
  const notificationsQueue = ref<Notification[]>([]);
  const notificationTime = 3000;
  let timer: number | null = null;

  function addNotification(notification: Notification) {
    const exists = notifications.value.some(
      (n) => notification.message === n.message
    );

    if (exists) {
      return;
    }

    if (notifications.value.length < 5) {
      notifications.value.push(notification);
      if (notifications.value.length === 1) {
        scheduledRemoval();
      }
    } else {
      notificationsQueue.value.push(notification);
    }
  }

  function scheduledRemoval() {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (notifications.value.length === 0) {
      if (notificationsQueue.value.length > 0) {
        const next = notificationsQueue.value.shift();
        if (next) {
          notifications.value.push(next);
          scheduledRemoval();
        }
      }
      return;
    }

    timer = window.setTimeout(() => {
      notifications.value.shift();
      if (notificationsQueue.value.length > 0) {
        const next = notificationsQueue.value.shift();
        if (next) {
          notifications.value.push(next);
        }
      }

      scheduledRemoval();
    }, notificationTime);
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex((n) => n.id === id);
    if (index < 0) return;
    notifications.value.splice(index, 1);
    if (notificationsQueue.value.length > 0) {
        const next = notificationsQueue.value.shift();
        if (next) {
          addNotification(next);
        }
      }
  }

  function addSuccessNotification(message: string) {
    addNotification({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      type: "success",
      message: message,
    });
  }
  function addErrorNotification(message: string) {
    addNotification({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      type: "error",
      message: message,
    });
  }
  function addAlertNotification(message: string) {
    addNotification({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      type: "alert",
      message: message,
    });
  }
  return {
    addErrorNotification,
    addSuccessNotification,
    removeNotification,
    addAlertNotification,
    notifications: readonly(notifications),
  };
});
