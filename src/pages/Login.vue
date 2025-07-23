<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="login" class="bg-white p-8 rounded shadow-md w-96">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      <div class="mb-4">
        <label class="block mb-1">Email</label>
        <input v-model="email" type="email" class="w-full border px-3 py-2 rounded" required />
      </div>
      <div class="mb-6">
        <label class="block mb-1">Senha</label>
        <input v-model="password" type="password" class="w-full border px-3 py-2 rounded" required />
      </div>
      <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Entrar</button>
      <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    async login() {
      try {
        const { data } = await api.post('/login', {
          email: this.email,
          password: this.password
        })
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        this.$router.push('/dashboard')
      } catch (e) {
        this.error = 'Credenciais inválidas'
      }
    }
  }
}
</script> 