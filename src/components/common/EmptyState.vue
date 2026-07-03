<script lang="ts" setup>
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="rounded-2xl p-12 text-center">
    <p class="text-lg font-medium text-gray-900">{{ title }}</p>
    <p v-if="description" class="mt-2 text-gray-500">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>
