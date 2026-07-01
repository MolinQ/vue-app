<script lang="ts" setup>
import FormField from "../components/common/form/MainInput.vue";
import FormButton from "../components/common/MainButton.vue";
import { useForm } from "vee-validate";
import authSchema from "@/schemas/login.schema.ts";
import { AuthService } from "@/services/AuthService.ts";
import type { UserCrenentials } from "@/types/auth.ts";
import router from "@/router/router.ts";

const { handleSubmit } = useForm({
  validationSchema: authSchema,
  initialValues: {
    email: "",
    password: "",
  },
  validateOnMount: false,
});

const authService = new AuthService();

const submit = handleSubmit(
  async (data: UserCrenentials) => {
    await authService.logIn(data);
    router.push("/");
  },
  (errors) => {
    console.log("ERRORS", errors);
  },
);
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Login</h1>

        <p class="mt-2 text-sm text-gray-500">Log in to your account</p>
      </div>

      <form @submit.prevent="submit" class="flex flex-col gap-5">
        <FormField
          type="email"
          name="email"
          placeholder="Email"
          autocomplete="email"
        />

        <FormField
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
        />

        <FormButton type="submit" size="lg" class="mt-2"> Log in </FormButton>
      </form>
    </div>
  </div>
</template>
