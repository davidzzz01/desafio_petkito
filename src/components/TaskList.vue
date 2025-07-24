<template>
  <div>
    <!-- Seção de Tarefas Pendentes -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4 flex items-center">
        <span class="mr-2">📋</span>
        Pendentes
        <span class="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
          {{ pending.length }}
        </span>
      </h2>
      
      <div v-if="pending.length" class="space-y-3">
        <TaskItem
          v-for="task in pending"
          :key="task.id"
          :task="task"
          @toggle-complete="toggleTaskComplete"
          @task-updated="$emit('task-updated')"
          @task-deleted="$emit('task-deleted')"
        />
      </div>
      <p v-else class="text-gray-500 italic">Nenhuma tarefa pendente. Ótimo trabalho!</p>
    </div>

    <!-- Seção de Tarefas Concluídas -->
    <div v-if="completed.length" class="mt-8">
      <h2 class="text-lg font-semibold mb-4 flex items-center">
        <span class="mr-2">✅</span>
        Concluídas
        <span class="ml-2 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
          {{ completed.length }}
        </span>
      </h2>
      
      <div class="space-y-3">
        <TaskItem
          v-for="task in completed"
          :key="task.id"
          :task="task"
          @toggle-complete="toggleTaskComplete"
          @task-updated="$emit('task-updated')"
          @task-deleted="$emit('task-deleted')"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue'

export default {
  props: {
    tasks: {
      type: Array,
      required: true
    }
  },
  components: { TaskItem },
  computed: {
    pending() {
      return this.tasks.filter(task => !task.completed)
    },
    completed() {
      return this.tasks.filter(task => task.completed)
    }
  },
  methods: {
    async toggleTaskComplete(taskId) {
      try {
        const response = await axios.put(`/api/tasks/${taskId}/complete`)
        this.$emit('task-updated')
      } catch (error) {
        console.error('Erro ao atualizar tarefa:', error)
        this.$toast.error('Erro ao atualizar tarefa')
      }
    }
  }
}
</script>