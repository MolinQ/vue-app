<script lang="ts" setup>
import { cn } from "tailwind-cn";
import { computed } from "vue";

import Button from "@/components/common/MainButton.vue";

const { message, centered = false, retry = false } = defineProps<{
  message: string;
  centered?: boolean;
  retry?: boolean;
}>();

defineEmits<{
  retry: [];
}>();

const wrapperClasses = computed(() =>
  cn(
    "rounded-2xl border border-red-200 bg-red-50 p-6 text-center",
    centered && "mx-auto max-w-md w-full",
  ),
);
</script>

<template>
  <div :class="wrapperClasses" role="alert">
    <p class="text-red-700">{{ message }}</p>

    <Button
      v-if="retry"
      class="mt-4"
      size="sm"
      variant="secondary"
      @click="$emit('retry')"
    >
      Try again
    </Button>
  </div>
</template>
