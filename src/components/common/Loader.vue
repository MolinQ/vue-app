<script lang="ts" setup>
import { cn } from "tailwind-cn";
import { computed } from "vue";

const { size = "md", centered = false } = defineProps<{
  size?: "sm" | "md" | "lg";
  centered?: boolean;
}>();

const sizeClasses = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

const spinnerClasses = computed(() =>
  cn("animate-spin text-blue-600", sizeClasses[size]),
);

const wrapperClasses = computed(() =>
  centered ? "flex justify-center items-center p-10" : "inline-flex",
);
</script>

<template>
  <div :class="wrapperClasses" role="status" aria-label="Loading">
    <svg :class="spinnerClasses" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-dasharray="32 56"
      />
    </svg>
  </div>
</template>
