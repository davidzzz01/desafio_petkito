<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-blue-900">Logs de Atividades</h2>
        <div class="flex items-center space-x-2">
          <span class="text-blue-900">Total: <b>{{ paginationInfo.total }}</b> logs</span>
          <button @click="exportPdf" class="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition">
            <i class="fas fa-file-pdf mr-2"></i> Exportar PDF
          </button>
        </div>
      </div>
      <div v-if="!logs.length" class="text-center text-blue-400 py-8">
        Nenhum log encontrado.
      </div>
      <table v-else class="w-full rounded-lg shadow text-gray-800 overflow-hidden">
        <thead>
          <tr class="bg-blue-900 text-white">
            <th class="py-3 px-4 text-left font-semibold">Usuário</th>
            <th class="py-3 px-4 text-left font-semibold">Tarefa</th>
            <th class="py-3 px-4 text-left font-semibold">Detalhes</th>
            <th class="py-3 px-4 text-left font-semibold">Data</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in logs" :key="log.id" class="bg-white hover:bg-blue-50 transition">
            <td class="py-2 px-4">{{ log.user && log.user.name }}</td>
            <td class="py-2 px-4">{{ log.task && log.task.title }}</td>
            <td class="py-2 px-4">{{ log.details }}</td>
            <td class="py-2 px-4">{{ formatDate(log.created_at) }}</td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="logs.length > 0" class="flex items-center justify-between mt-6">
        <div class="text-sm text-gray-700">
          Mostrando {{ paginationInfo.from || 0 }} a {{ paginationInfo.to || 0 }} de {{ paginationInfo.total || 0 }} resultados
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
      logs: [],
      currentPage: 1,
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
    visiblePages() {
      const current = this.paginationInfo.page
      const last = this.paginationInfo.last_page
      const pages = []
      
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
  methods: {
    async fetchLogs(page = 1) {
      try {
        const params = {
          page,
          per_page: 10
        }
        
        const response = await api.get('/logs', { params })
        
        this.logs = response.data.data || []
        this.paginationInfo = {
          total: response.data.total || 0,
          per_page: response.data.per_page || 10,
          page: response.data.page || 1,
          next_page: response.data.next_page,
          last_page: response.data.last_page || 1,
          previous_page: response.data.previous_page,
          from: response.data.total > 0 ? ((response.data.page - 1) * response.data.per_page) + 1 : 0,
          to: response.data.total > 0 ? Math.min(response.data.page * response.data.per_page, response.data.total) : 0
        }
        this.currentPage = page
      } catch (error) {
        console.error('Erro ao buscar logs:', error)
        this.logs = []
        this.paginationInfo = {
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
    changePage(page) {
      this.fetchLogs(page)
    },
    formatDate(date) {
      return new Date(date).toLocaleString('pt-BR')
    },
    async exportPdf() {
      try {
        const response = await api.get('/logs/pdf', { responseType: 'blob' })
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
        window.open(url, '_blank')
      } catch (e) {
        alert('Erro ao gerar PDF. Verifique se está autenticado.')
      }
    }
  },
  mounted() {
    this.fetchLogs()
  }
}
</script> 