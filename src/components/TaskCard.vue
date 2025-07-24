<template>
  <div class="bg-blue-950 rounded-xl shadow-lg p-6 flex flex-col justify-between h-full border border-blue-800">
    <div>
      <div class="flex items-center justify-between mb-2">
        <h3 :class="{'line-through text-blue-400': task.completed}" class="text-lg font-bold text-white">{{ task.title }}</h3>
        <span v-if="task.completed" class="text-green-400"><i class="fas fa-check-circle"></i></span>
      </div>
      <p class="text-blue-200 mb-2">{{ task.description }}</p>
      <p class="text-xs text-blue-400">Vence em: {{ formatDate(task.due_date) }}</p>
    </div>
    <div class="flex items-center justify-between mt-4">
      <button
        v-if="!task.completed"
        @click="markAsCompleted"
        class="flex items-center px-3 py-1 bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-lg shadow hover:from-blue-800 hover:to-blue-600 transition"
      >
        <i class="fas fa-check mr-2"></i> Concluir
      </button>
      <button
        @click="deleteTask"
        class="flex items-center px-3 py-1 bg-gradient-to-r from-red-700 to-red-500 text-white rounded-lg shadow hover:from-red-800 hover:to-red-600 transition"
      >
        <i class="fas fa-trash-alt mr-2"></i> Excluir
      </button>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  props: ['task'],
  methods: {
    async markAsCompleted() {
      await api.put(`/tasks/${this.task.id}/complete`)
      this.$emit('task-updated')
    },
    async deleteTask() {
      await api.delete(`/tasks/${this.task.id}`)
      this.$emit('task-deleted')
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    }
  }
}
</script> 