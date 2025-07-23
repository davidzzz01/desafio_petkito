<template>
  <div class="min-h-screen bg-gray-100">
    <div class="flex justify-between items-center p-4 bg-white shadow">
      <h1 class="text-xl font-bold">Minhas Tarefas</h1>
      <div>
        <span class="mr-4">Olá, {{ user.name }}</span>
        <button @click="logout" class="bg-red-500 text-white px-3 py-1 rounded">Sair</button>
      </div>
    </div>
    <div class="max-w-2xl mx-auto mt-8">
      <TaskForm v-if="isAdmin" @task-added="fetchTasks" />
      <TaskList
        :tasks="tasks"
        @task-updated="fetchTasks"
        @task-deleted="fetchTasks"
      />
    </div>
  </div>
</template>

<script>
import TaskForm from '../components/TaskForm.vue'
import TaskList from '../components/TaskList.vue'
import api from '../services/api'

export default {
  components: { TaskForm, TaskList },
  data() {
    return {
      tasks: [],
      user: null
    }
  },
  computed: {
    isAdmin() {
      return this.user && this.user.role === 'admin'
    }
  },
  methods: {
    async fetchTasks() {
      const { data } = await api.get('/tasks')
      this.tasks = data
    },
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user'))
    this.fetchTasks()
  }
}
</script> 