<script setup lang="ts">
import { reactive } from 'vue';
import { useFormValidation } from './composables/useFormValidation';
import { useApi } from './composables/useApi';

// Реактивные значения формы
const formValues = reactive({
  email: '',
  password: '',
});

// Правила валидации
const rules = {
  email: [
    (v: string) => (!!v ? null : 'Email is required'),
    (v: string) => (/.+@.+\..+/.test(v) ? null : 'Email must be valid'),
  ],
  password: [
    (v: string) => (v.length >= 6 ? null : 'Password must be at least 6 characters'),
  ],
};

// Использование композабла для валидации
const { errors, dirty, isValid, validateAll, touch } = useFormValidation(
    rules,
    formValues
);

// Использование композабла для API
const api = useApi<{ id: number }>({
  url: 'https://jsonplaceholder.typicode.com/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Обработчик отправки формы
async function handleSubmit() {
  if (!validateAll()) {
    alert('Form has errors. Please fix them.');
    return;
  }

  // Отправка данных на сервер
  api.execute();

  // Обработка результата
  if (api.isSuccess.value) {
    alert('Form submitted successfully!');
  } else if (api.isError.value) {
    alert(`Error: ${api.error.value}`);
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
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

<style>
.error {
  color: red;
  font-size: 0.9em;
  margin-top: 4px;
}

.success {
  color: green;
  font-size: 0.9em;
  margin-top: 4px;
}
</style>