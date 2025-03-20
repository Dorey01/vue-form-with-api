<script setup lang="ts">
import { reactive } from 'vue';
import { useFormValidation } from './composables/useFormValidation';
import { useApi } from './composables/useApi';


const formValues = reactive({
  email: '',
  password: '',
});


const rules = {
  email: [
    (v: string) => (!!v ? null : 'Email is required'),
    (v: string) => (/.+@.+\..+/.test(v) ? null : 'Email must be valid'),
  ],
  password: [
    (v: string) => (v.length >= 6 ? null : 'Password must be at least 6 characters'),
  ],
};


const { errors, dirty, isValid, validateAll, touch } = useFormValidation(
    rules,
    formValues
);

const api = useApi<{ id: number }>({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});


async function handleSubmit() {
  if (!validateAll()) {
    alert('Form has errors. Please fix them.');
    return;
  }


  api.execute();


  if (api.isSuccess.value) {
    alert('Form submitted successfully!');
  } else if (api.isError.value) {
    alert(`Error: ${api.error.value}`);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <h1>Login Form</h1>
    <div>
      <label>Email:</label>
      <input
          v-model="formValues.email"
          @blur="touch('email')"
          placeholder="Enter your email"
      />
      <div v-if="dirty.email && errors.email" class="error">
        {{ errors.email?.join(', ') }}
      </div>
    </div>

    <div>
      <label>Password:</label>
      <input
          v-model="formValues.password"
          type="password"
          @blur="touch('password')"
          placeholder="Enter your password"
      />
      <div v-if="dirty.password && errors.password" class="error">
        {{ errors.password?.join(', ') }}
      </div>
    </div>

    <button type="submit" :disabled="!isValid || api.isLoading.value">
      {{ api.isLoading.value ? 'Submitting...' : 'Submit' }}
    </button>

    <div v-if="api.isSuccess.value" class="success">
      Form submitted successfully! Response: {{ api.data.value }}
    </div>
    <div v-if="api.isError.value" class="error">
      Error: {{ api.error.value }}
    </div>
  </form>
</template>

<style scoped>
form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

input {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.success {
  color: #28a745;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}
</style>
<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  margin: auto;
}

</style>

<style>

html, body {
  height: 100%;
  margin: 0;
  font-family: 'Arial Rounded MT Bold', Arial, sans-serif;
  background: linear-gradient(45deg,
  #ff6b6b 0%,
  #4ecdc4 50%,
  #45b7d1 100%);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>