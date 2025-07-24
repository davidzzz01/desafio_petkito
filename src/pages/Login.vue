<template>
  <div class="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-950 to-blue-800">
    <form @submit.prevent="login" class="bg-blue-900 p-8 rounded-xl shadow-lg w-96 border border-blue-800">
      <h2 class="text-3xl font-bold mb-6 text-center text-white">Login</h2>
      <div class="mb-4">
        <label class="block mb-1 text-blue-200">Email</label>
        <input v-model="email" type="email" class="w-full border border-blue-700 bg-blue-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>
      <div class="mb-6">
        <label class="block mb-1 text-blue-200">Senha</label>
        <input v-model="password" type="password" class="w-full border border-blue-700 bg-blue-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
      </div>
      <button type="submit" class="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 rounded-lg hover:from-blue-800 hover:to-blue-600 font-semibold flex items-center justify-center transition">
        <i class="fas fa-sign-in-alt mr-2"></i> Entrar
      </button>
      <p v-if="error" class="text-red-400 mt-4 text-center">{{ error }}</p>
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
        this.error = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Credenciais inválidas'
      }
    }
  }
}
</script> 