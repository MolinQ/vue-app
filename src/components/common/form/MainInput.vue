<script lang="ts" setup>
import { cn } from "tailwind-cn";
import type { InputTypeHTMLAttribute } from "vue";
import { computed } from "vue";
import { useField } from "vee-validate";

const {
  name,
  type,
  classes = "",
  placeholder = "",
  lable = "",
  min = 0,
  max = 0,
  autocomplete = "",
  disabled = false,
} = defineProps<{
  name: string;
  type: InputTypeHTMLAttribute;
  classes?: string;
  placeholder?: string;
  lable?: string;
  min?: number;
  max?: number;
  autocomplete?: string;
  disabled?: boolean;
}>();

const { value, errorMessage } = useField(name);

const baseClasses = `
  w-full
  rounded-xl
  border
  px-4
  py-3
  text-sm
  text-gray-900
  bg-white
  outline-none
  transition-all
  duration-200
  placeholder:text-gray-400
  mt-2
`;

const mergedClasses = computed(() =>
  cn(
    baseClasses,

    errorMessage.value
      ? `
        border-red-400
        focus:border-red-500
        focus:ring-red-100
      `
      : `
        border-gray-200
        hover:border-gray-300
        focus:border-blue-500
        focus:ring-blue-100
      `,

    classes,
  ),
);
</script>

<template>
  <div>
    <lable class="text-sm font-bold text-gray-900 px-2">{{ lable }}</lable>
    <input
      v-model="value"
      :name="name"
      :type="type"
      :class="mergedClasses"
      :placeholder="placeholder"
      :min="min"
      :max="max"
      :autocomplete="autocomplete"
      :disabled="disabled"
    />

    <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>
