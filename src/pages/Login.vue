<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import FormField from "../components/common/form/MainInput.vue";
import FormButton from "../components/common/MainButton.vue";
import { useForm } from "vee-validate";
import authSchema from "@/schemas/login.schema.ts";
import { AuthError, useAuthStore } from "@/stores/authStore";
import type { UserCredentials } from "@/types/auth.ts";
import router from "@/router/router.ts";

const authStore = useAuthStore();
const authError = ref("");

const { handleSubmit } = useForm({
  validationSchema: authSchema,
  initialValues: {
    login: "",
    password: "",
  },
  validateOnMount: false,
});

const submit = handleSubmit(async (data: UserCredentials) => {
  authError.value = "";

  try {
    await authStore.login(data);
    router.push("/");
  } catch (error) {
    authError.value =
      error instanceof AuthError ? error.message : "Login failed";
  }
});
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
          type="text"
          name="login"
          placeholder="Login"
          autocomplete="username"
        />

        <FormField
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="current-password"
        />

        <p v-if="authError" class="text-sm text-red-500">
          {{ authError }}
        </p>

        <FormButton type="submit" size="lg" class="mt-2"> Log in </FormButton>

        <p class="text-center text-sm text-gray-500">
          Don't have an account?
          <RouterLink to="/register" class="text-blue-600 hover:underline">
            Register
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
