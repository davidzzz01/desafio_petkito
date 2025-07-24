<template>
  <AppLayout>
    <div class="max-w-lg mx-auto bg-gray-800 p-8 rounded-lg shadow mt-8">
      <h2 class="text-2xl font-bold mb-6 text-blue-200 text-center">Criar Tarefa</h2>
      <form @submit.prevent="addTask">
        <div class="mb-4">
          <label class="block mb-1 text-blue-200 font-semibold">Usuário</label>
          <select v-model="user_id" class="w-full border border-blue-700 bg-gray-900 text-white px-3 py-2 rounded" required>
            <option value="" disabled>Selecione um usuário</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-200 font-semibold">Título *</label>
          <input v-model="title" class="w-full border border-blue-700 bg-gray-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-200 font-semibold">Descrição</label>
          <textarea v-model="description" class="w-full border border-blue-700 bg-gray-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
        </div>
        <div class="mb-4">
          <label class="block mb-1 text-blue-200 font-semibold">Data de Vencimento *</label>
          <input v-model="due_date" type="date" class="w-full border border-blue-700 bg-gray-900 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400" required />
        </div>
        <button type="submit" class="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-2 rounded-lg hover:from-blue-800 hover:to-blue-600 font-semibold flex items-center justify-center transition">
          <i class="fas fa-plus mr-2"></i> Criar Tarefa
        </button>
        <p v-if="error" class="text-red-400 mt-4 text-center">{{ error }}</p>
        <p v-if="success" class="text-green-400 mt-4 text-center">Tarefa criada com sucesso!</p>
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
      users: [],
      user_id: '',
      title: '',
      description: '',
      due_date: '',
      error: '',
      success: false
    }
  },
  async mounted() {
    const { data } = await api.get('/users')
    this.users = data
  },
  methods: {
    async addTask() {
      this.error = ''
      this.success = false
      if (!this.title || !this.due_date || !this.user_id) {
        this.error = 'Preencha todos os campos obrigatórios.'
        return
      }
      try {
        await api.post('/tasks', {
          user_id: this.user_id,
          title: this.title,
          description: this.description,
          due_date: this.due_date
        })
        this.title = ''
        this.description = ''
        this.due_date = ''
        this.user_id = ''
        this.success = true
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Erro ao criar tarefa.'
      }
    }
  }
}
</script> 