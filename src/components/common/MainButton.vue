<script lang="ts" setup>
import { cn } from "tailwind-cn";
import { computed } from "vue";

const {
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
} = defineProps<{
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}>();

const baseClasses = `
  inline-flex
  items-center
  justify-center
  gap-2
  rounded-xl
  font-semibold
  transition-all
  duration-200
  outline-none

  disabled:pointer-events-none
  disabled:opacity-50

  active:scale-[0.98]
`;

const variants = {
  primary: `
    bg-blue-600
    text-white
    hover:bg-blue-700
    focus:ring-4
    focus:ring-blue-200
  `,

  secondary: `
    bg-gray-100
    text-gray-900
    hover:bg-gray-200
    focus:ring-4
    focus:ring-gray-200
  `,

  danger: `
    bg-red-500
    text-white
    hover:bg-red-600
    focus:ring-4
    focus:ring-red-200
  `,

  ghost: `
    bg-transparent
    text-gray-700
    hover:bg-gray-100
  `,
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-5 py-3 text-sm",
  lg: "px-6 py-4 text-base",
};

const buttonClasses = computed(() =>
  cn(baseClasses, variants[variant], sizes[size]),
);
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="buttonClasses">
    <svg
      v-if="loading"
      class="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
        class="opacity-25"
      />

      <path fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>

    <slot />
  </button>
</template>
