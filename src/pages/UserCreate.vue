<template>
  <AppLayout>
    <div class="max-w-lg mx-auto bg-white p-8 rounded-lg shadow mt-8">
      <h2 class="text-2xl font-bold mb-6 text-blue-900 text-center">Criar Usuário</h2>
      <form @submit.prevent="createUser">
        <div class="mb-4">
          <label class="block mb-1 text-blue-900 font-semibold">Nome</label>
          <input v-model="name" class="w-full border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-900 font-semibold">Email</label>
          <input v-model="email" type="email" class="w-full border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-900 font-semibold">Senha</label>
          <input v-model="password" type="password" class="w-full border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-900 font-semibold">Tipo</label>
          <select v-model="is_admin" class="w-full border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required>
            <option :value="false">Usuário</option>
            <option :value="true">Administrador</option>
          </select>
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 rounded-lg hover:from-blue-800 hover:to-blue-600 font-semibold flex items-center justify-center transition">
          <i class="fas fa-user-plus mr-2"></i>Criar Usuário
        </button>
        <p v-if="error" class="text-red-400 mt-4 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-400 mt-4 text-center">Usuário criado com sucesso!</p>
      </form>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import api from '../services/api'
export default {
  components: { AppLayout },
  data() {
    return {
      name: '',
      email: '',
      password: '',
      is_admin: false,
      error: '',
      success: false
    }
  },
  methods: {
    async createUser() {
      this.error = ''
      this.success = false
      try {
        await api.post('/user', {
          name: this.name,
          email: this.email,
          password: this.password,
          is_admin: this.is_admin
        })
        this.success = true
        this.name = ''
        this.email = ''
        this.password = ''
        this.is_admin = false
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Erro ao criar usuário.'
      }
    }
  }
}
</script> 