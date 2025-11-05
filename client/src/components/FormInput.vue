<script setup lang="ts">
import { validateName, validateEmail } from "@/utils/Validations";

const props = defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
  blur: [value: string];
}>();

const validate = (value: string) => {
  if (props.type === "email") return validateEmail(value);
  return validateName(value);
};

const handleBlur = () => {
  emit("blur", props.modelValue);
};
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}<span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type || 'text'"
      :placeholder="placeholder"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="handleBlur"
      :class="[
        'w-full bg-[#F1F2F4] p-3 rounded-md focus:outline-none focus:ring-2 transition-colors',
        error
          ? 'border-2 border-red-500 focus:ring-red-500'
          : 'border border-gray-300 focus:ring-blue-500',
      ]"
    />
    <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
  </div>
</template>