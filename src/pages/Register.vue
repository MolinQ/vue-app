<script lang="ts" setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import FormField from "../components/common/form/MainInput.vue";
import FormButton from "../components/common/MainButton.vue";
import { useForm } from "vee-validate";
import registerSchema from "@/schemas/register.schema";
import { AuthError, useAuthStore } from "@/stores/authStore";
import type { RegisterData } from "@/types/auth";
import router from "@/router/router";

const authStore = useAuthStore();
const authError = ref("");

const { handleSubmit } = useForm({
  validationSchema: registerSchema,
  initialValues: {
    login: "",
    name: "",
    password: "",
    confirmPassword: "",
  },
  validateOnMount: false,
});

const submit = handleSubmit(
  async (data: RegisterData & { confirmPassword: string }) => {
    authError.value = "";

    try {
      await authStore.register({
        login: data.login,
        name: data.name,
        password: data.password,
      });
      router.push("/");
    } catch (error) {
      authError.value =
        error instanceof AuthError ? error.message : "Registration failed";
    }
  },
);
</script>

<template>
  <div class="min-h-screen w-full flex items-center justify-center px-4">
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100"
    >
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-900">Register</h1>
        <p class="mt-2 text-sm text-gray-500">Create a new account</p>
      </div>

      <form @submit.prevent="submit" class="flex flex-col gap-5">
        <FormField
          type="text"
          name="login"
          placeholder="Login"
          autocomplete="username"
        />

        <FormField
          type="text"
          name="name"
          placeholder="Display name"
          autocomplete="name"
        />

        <FormField
          type="password"
          name="password"
          placeholder="Password"
          autocomplete="new-password"
        />

        <FormField
          type="password"
          name="confirmPassword"
          placeholder="Confirm password"
          autocomplete="new-password"
        />

        <p v-if="authError" class="text-sm text-red-500">
          {{ authError }}
        </p>

        <FormButton type="submit" size="lg" class="mt-2">
          Create account
        </FormButton>

        <p class="text-center text-sm text-gray-500">
          Already have an account?
          <RouterLink to="/login" class="text-blue-600 hover:underline">
            Log in
          </RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
