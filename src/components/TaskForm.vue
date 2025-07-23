<template>
  <form @submit.prevent="addTask" class="mb-6 bg-white p-4 rounded shadow">
    <div class="mb-2">
      <label class="block mb-1">Título *</label>
      <input v-model="title" class="w-full border px-2 py-1 rounded" required />
    </div>
    <div class="mb-2">
      <label class="block mb-1">Descrição</label>
      <textarea v-model="description" class="w-full border px-2 py-1 rounded"></textarea>
    </div>
    <div class="mb-2">
      <label class="block mb-1">Data de Vencimento *</label>
      <input v-model="due_date" type="date" class="w-full border px-2 py-1 rounded" required />
    </div>
    <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Adicionar Tarefa</button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
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
      } catch (e) {
        this.error = 'Erro ao adicionar tarefa.'
      }
    }
  }
}
</script> 