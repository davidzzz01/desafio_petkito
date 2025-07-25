<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-blue-900">Logs de Atividades</h2>
        <button @click="exportPdf" class="flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg shadow hover:bg-blue-800 transition">
          <i class="fas fa-file-pdf mr-2"></i> Exportar PDF
        </button>
      </div>
      <table class="w-full rounded-lg shadow text-gray-800 overflow-hidden">
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
      <div v-if="!logs.length" class="text-center text-blue-400 py-8">
        Nenhum log encontrado.
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
      logs: []
    }
  },
  methods: {
    async fetchLogs() {
      const { data } = await api.get('/logs')
      this.logs = data
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