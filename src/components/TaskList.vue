<template>
  <div>
    <h2 class="text-lg font-semibold mb-2">Pendentes</h2>
    <div v-if="pending.length">
      <TaskItem
        v-for="task in pending"
        :key="task.id"
        :task="task"
        @task-updated="$emit('task-updated')"
        @task-deleted="$emit('task-deleted')"
      />
    </div>
    <p v-else class="text-gray-500">Nenhuma tarefa pendente.</p>

    <h2 class="text-lg font-semibold mt-6 mb-2">Concluídas</h2>
    <div v-if="completed.length">
      <TaskItem
        v-for="task in completed"
        :key="task.id"
        :task="task"
        @task-updated="$emit('task-updated')"
        @task-deleted="$emit('task-deleted')"
      />
    </div>
    <p v-else class="text-gray-500">Nenhuma tarefa concluída.</p>
  </div>
</template>

<script>
import TaskItem from './TaskItem.vue'
export default {
  props: ['tasks'],
  components: { TaskItem },
  computed: {
    pending() {
      return this.tasks.filter(t => !t.completed)
    },
    completed() {
      return this.tasks.filter(t => t.completed)
    }
  }
}
</script> 