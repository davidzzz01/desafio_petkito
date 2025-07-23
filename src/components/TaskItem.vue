<template>
  <div class="flex items-center justify-between bg-white p-3 mb-2 rounded shadow">
    <div>
      <h3 :class="{'line-through text-gray-400': task.completed}" class="font-bold">{{ task.title }}</h3>
      <p class="text-sm text-gray-600">{{ task.description }}</p>
      <p class="text-xs text-gray-500">Vence em: {{ task.due_date }}</p>
    </div>
    <div class="flex items-center space-x-2">
      <button
        v-if="!task.completed"
        @click="markAsCompleted"
        class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
      >Concluir</button>
      <button
        @click="deleteTask"
        class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
      >Excluir</button>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  props: ['task'],
  methods: {
    async markAsCompleted() {
      await api.put(`/tasks/${this.task.id}`, { completed: true })
      this.$emit('task-updated')
    },
    async deleteTask() {
      await api.delete(`/tasks/${this.task.id}`)
      this.$emit('task-deleted')
    }
  }
}
</script> 