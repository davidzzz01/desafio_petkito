<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <div class="flex flex-row items-center space-x-2 mb-4 ml-0 md:ml-2">
        <input
          v-model="search"
          placeholder="Buscar tarefa..."
          class="border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          v-model="filter"
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
          <tr v-for="task in paginatedTasks" :key="task.id" class="bg-white hover:bg-blue-50 transition">
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
      
      <div v-if="filteredTasks.length > 0" class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-700">
          Mostrando {{ paginationInfo.from || 0 }} a {{ paginationInfo.to || 0 }} de {{ filteredTasks.length }} resultados
        </div>
        
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(paginationInfo.previous_page)"
            :disabled="!paginationInfo.previous_page"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-chevron-left mr-1"></i>
            Anterior
          </button>
          
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md',
                page === paginationInfo.page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="changePage(paginationInfo.next_page)"
            :disabled="!paginationInfo.next_page"
            class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
            <i class="fas fa-chevron-right ml-1"></i>
          </button>
        </div>
      </div>
      
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
      user: null,
      currentPage: 1,
      perPage: 10,
      paginationInfo: {
        total: 0,
        per_page: 10,
        page: 1,
        next_page: null,
        last_page: 1,
        previous_page: null,
        from: 0,
        to: 0
      }
    }
  },
  computed: {
    filteredTasks() {
      let tasks = this.tasks
      
      if (this.search) {
        const searchLower = this.search.toLowerCase()
        tasks = tasks.filter(task => 
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
        )
      }
      
      if (this.filter) {
        if (this.filter === 'pending') {
          tasks = tasks.filter(task => !task.completed)
        } else if (this.filter === 'completed') {
          tasks = tasks.filter(task => task.completed)
        }
      }
      
      return tasks
    },
    paginatedTasks() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.filteredTasks.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredTasks.length / this.perPage)
    },
    visiblePages() {
      const current = this.currentPage
      const last = this.totalPages
      const pages = []
      
      if (last <= 0) return pages
      
      let start = Math.max(1, current - 2)
      let end = Math.min(last, current + 2)
      
      if (end - start < 4) {
        if (start === 1) {
          end = Math.min(last, start + 4)
        } else {
          start = Math.max(1, end - 4)
        }
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  },
  watch: {
    search() {
      this.currentPage = 1
      this.updatePaginationInfo()
    },
    filter() {
      this.currentPage = 1
      this.updatePaginationInfo()
    }
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await api.get('/tasks')
        this.tasks = response.data.data || []
        this.currentPage = 1
        this.updatePaginationInfo()
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error)
        this.tasks = []
        this.currentPage = 1
        this.updatePaginationInfo()
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    },
    async markAsCompleted(task) {
      try {
        await api.put(`/tasks/${task.id}/complete`)
        this.fetchTasks()
      } catch (error) {
        console.error('Erro ao marcar tarefa como concluída:', error)
        alert('Erro ao marcar tarefa como concluída')
      }
    },
    async deleteTask(task) {
      try {
        await api.delete(`/tasks/${task.id}`)
        this.fetchTasks()
      } catch (error) {
        console.error('Erro ao deletar tarefa:', error)
        alert('Erro ao deletar tarefa')
      }
    },
    changePage(page) {
      if (page && page !== this.currentPage && page <= this.totalPages) {
        this.currentPage = page
        this.updatePaginationInfo()
      }
    },
    updatePaginationInfo() {
      const total = this.filteredTasks.length
      const from = total > 0 ? ((this.currentPage - 1) * this.perPage) + 1 : 0
      const to = total > 0 ? Math.min(this.currentPage * this.perPage, total) : 0
      
      this.paginationInfo = {
        total,
        per_page: this.perPage,
        page: this.currentPage,
        next_page: this.currentPage < this.totalPages ? this.currentPage + 1 : null,
        last_page: this.totalPages,
        previous_page: this.currentPage > 1 ? this.currentPage - 1 : null,
        from,
        to
      }
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