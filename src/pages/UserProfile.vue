<script lang="ts" setup>
import { useForm } from "vee-validate";

import FormField from "@/components/common/form/MainInput.vue";
import Button from "@/components/common/MainButton.vue";
import { UserInfoStore } from "@/stores/userInfo";
import router from "@/router/router";

const userStore = UserInfoStore();

userStore.getUserInfo();

const { handleSubmit } = useForm({
  initialValues: {
    email: userStore.userData?.email ?? "",
    name: userStore.userData?.name ?? "",
  },
});

const submit = handleSubmit(
  async (data) => {
    userStore.setUserInfo(data);
    router.push("/home");
  },
  (errors) => {
    console.log("ERRORS", errors);
  },
);
</script>

<template>
  <div class="flex justify-center items-center h-full">
    <div
      class="w-full h-fit max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
      </div>
      <form @submit.prevent="submit" class="flex flex-col gap-5">
        <FormField
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        />

        <FormField type="text" name="name" placeholder="Name" />

        <Button type="submit" size="lg" class="mt-2">Edit</Button>
      </form>
    </div>
  </div>
</template>
