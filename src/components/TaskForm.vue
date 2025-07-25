<template>
  <form @submit.prevent="addTask" class="mb-6 bg-white p-6 rounded shadow-lg max-w-lg mx-auto">
    <h2 class="text-xl font-bold mb-4">Adicionar Tarefa</h2>
    <div class="mb-4">
      <label class="block mb-1 font-semibold">Título *</label>
      <input v-model="title" class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-semibold">Descrição</label>
      <textarea v-model="description" class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
    </div>
    <div class="mb-4">
      <label class="block mb-1 font-semibold">Data de Vencimento *</label>
      <input v-model="due_date" type="date" class="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required />
    </div>
    <button type="submit" class="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 font-semibold flex items-center justify-center">
      <i class="fas fa-plus mr-2"></i>Adicionar Tarefa
    </button>
    <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
  </form>
</template>

<script>
import api from '../services/api'
export default {
  data() {
    return {
      title: '',
      description: '',
      due_date: '',
      error: ''
    }
  },
  methods: {
    async addTask() {
      if (!this.title || !this.due_date) {
        this.error = 'Preencha todos os campos obrigatórios.'
        return
      }
      try {
        await api.post('/tasks', {
          title: this.title,
          description: this.description,
          due_date: this.due_date
        })
        this.title = ''
        this.description = ''
        this.due_date = ''
        this.error = ''
        this.$emit('task-added')
        this.$emit('task-updated')
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.message)
          ? e.response.data.message
          : 'Erro ao adicionar tarefa.'
      }
    }
  }
}
</script>
 