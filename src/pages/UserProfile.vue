<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { useForm } from "vee-validate";

import FormField from "@/components/common/form/MainInput.vue";
import Button from "@/components/common/MainButton.vue";
import profileSchema from "@/schemas/profile.schema";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const isReady = ref(false);
const isSaved = ref(false);

const { handleSubmit, resetForm } = useForm({
  validationSchema: profileSchema,
  initialValues: {
    name: "",
  },
});

onMounted(async () => {
  if (!authStore.isInitialized) {
    await authStore.init();
  }

  resetForm({
    values: {
      name: authStore.currentUser?.name ?? "",
    },
  });

  isReady.value = true;
});

const submit = handleSubmit(async (data) => {
  await authStore.updateDisplayName(data.name);
  isSaved.value = true;
});
</script>

<template>
  <div
    v-if="isReady && authStore.currentUser"
    class="flex justify-center items-center min-h-[calc(100vh-4rem)] px-4 py-8"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
        <p class="mt-2 text-sm text-gray-500">View and edit your profile</p>
      </div>

      <div class="mb-6 rounded-xl bg-gray-50 p-4">
        <p class="text-sm text-gray-500">Login</p>
        <p class="mt-1 font-medium text-gray-900">
          {{ authStore.currentUser.login }}
        </p>
      </div>

      <form @submit.prevent="submit" class="flex flex-col gap-5">
        <FormField
          type="text"
          name="name"
          placeholder="Display name"
          lable="Name"
          autocomplete="name"
        />

        <p v-if="isSaved" class="text-sm text-green-600">
          Profile saved successfully.
        </p>

        <Button type="submit" size="lg" class="mt-2">Save changes</Button>
      </form>
    </div>
  </div>
</template>
