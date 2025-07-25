<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-row items-center space-x-2 mb-4 ml-0 md:ml-2">
        <input
          v-model="search"
          @input="fetchTasks"
          placeholder="Buscar tarefa..."
          class="border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          v-model="filter"
          @change="fetchTasks"
          class="border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas</option>
          <option value="pending">Pendentes</option>
          <option value="completed">Concluídas</option>
        </select>
        <span class="text-blue-900 ml-2">Total: <b>{{ filteredTasks.length }}</b> tarefas</span>
      </div>
      <div v-if="!filteredTasks.length" class="text-center text-blue-400 py-8">
        Nenhuma tarefa encontrada.
      </div>
      <table v-else class="w-full rounded-lg shadow text-gray-800 overflow-hidden">
        <thead>
          <tr class="bg-blue-900 text-white">
            <th class="py-3 px-4 text-left font-semibold">Título</th>
            <th class="py-3 px-4 text-left font-semibold">Descrição</th>
            <th class="py-3 px-4 text-left font-semibold">Vencimento</th>
            <th class="py-3 px-4 text-left font-semibold">Status</th>
            <th class="py-3 px-4 text-left font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="task in filteredTasks" :key="task.id" class="bg-white hover:bg-blue-50 transition">
            <td class="py-2 px-4">{{ task.title }}</td>
            <td class="py-2 px-4">{{ task.description }}</td>
            <td class="py-2 px-4">{{ formatDate(task.due_date) }}</td>
            <td class="py-2 px-4">
              <span v-if="task.completed" class="text-green-600 font-semibold"><i class="fas fa-check-circle"></i> Concluída</span>
              <span v-else class="text-blue-900 font-semibold">Pendente</span>
            </td>
            <td class="py-2 px-4">
              <button
                v-if="!task.completed"
                @click="markAsCompleted(task)"
                class="text-blue-600 hover:text-blue-800 mr-2"
                title="Concluir"
              >
                <i class="fas fa-check"></i>
              </button>
              <button
                @click="deleteTask(task)"
                class="text-red-600 hover:text-red-800 mr-2"
                title="Excluir"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-end mt-8 space-x-2">
        <button
          class="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition"
          @click="exportPdf"
        >
          <i class="fas fa-file-pdf mr-2"></i> Exportar PDF
        </button>
      </div>
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
      tasks: [],
      search: '',
      filter: '',
      user: null
    }
  },
  computed: {
    filteredTasks() {
      let tasks = this.tasks
      if (this.search) {
        tasks = tasks.filter(t => t.title.toLowerCase().includes(this.search.toLowerCase()))
      }
      if (this.filter === 'pending') {
        tasks = tasks.filter(t => !t.completed)
      } else if (this.filter === 'completed') {
        tasks = tasks.filter(t => t.completed)
      }
      return tasks
    }
  },
  methods: {
    async fetchTasks() {
      const { data } = await api.get('/tasks')
      this.tasks = data
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },
    async markAsCompleted(task) {
      await api.put(`/tasks/${task.id}/complete`)
      this.fetchTasks()
    },
    async deleteTask(task) {
      await api.delete(`/tasks/${task.id}`)
      this.fetchTasks()
    },
    async exportPdf() {
      try {
        const response = await api.get('/task/pdf', { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        window.open(url, '_blank')
      } catch (e) {
        alert('Erro ao gerar PDF. Verifique se está autenticado.')
      }
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fetchTasks()
  }
}
</script> 