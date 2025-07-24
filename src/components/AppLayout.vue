<template>
  <div class="flex min-h-screen bg-gray-600">
    <aside class="w-64 bg-blue-950 shadow-lg flex flex-col border-r border-blue-900">
      <div class="h-20 flex items-center justify-center border-b border-blue-900">
        <span class="text-2xl font-bold text-blue-200">ToDo Pro</span>
      </div>
      <nav class="flex-1 px-4 py-6 space-y-2">
        <router-link to="/dashboard" class="flex items-center px-3 py-2 rounded hover:bg-blue-900 text-blue-200" active-class="bg-blue-900 font-bold">
          <i class="fas fa-list-check mr-2 text-blue-400"></i> Tarefas
        </router-link>
        <router-link v-if="isAdmin" to="/tasks/create" class="flex items-center px-3 py-2 rounded hover:bg-blue-900 text-blue-200" active-class="bg-blue-900 font-bold">
          <i class="fas fa-plus mr-2 text-blue-400"></i> Nova Tarefa
        </router-link>
        <router-link v-if="isAdmin" to="/users/create" class="flex items-center px-3 py-2 rounded hover:bg-blue-900 text-blue-200" active-class="bg-blue-900 font-bold">
          <i class="fas fa-user-plus mr-2 text-green-400"></i> Criar Usuário
        </router-link>
        <router-link v-if="isAdmin" to="/users" class="flex items-center px-3 py-2 rounded hover:bg-blue-900 text-blue-200" active-class="bg-blue-900 font-bold">
          <i class="fas fa-users mr-2 text-blue-400"></i> Usuários
        </router-link>
      </nav>
      <div class="p-4 border-t border-blue-900">
        <button @click="logout" class="w-full flex items-center justify-center px-3 py-2 rounded bg-blue-900 text-blue-200 hover:bg-blue-800">
          <i class="fas fa-sign-out-alt mr-2"></i> Sair
        </button>
      </div>
    </aside>
    <div class="flex-1 flex flex-col">
      <header class="h-20 bg-blue-900 shadow flex items-center justify-between px-8">
        <div>
          <h1 class="text-xl font-bold text-white">Olá, {{ user && user.name }}</h1>
          <span class="text-xs text-blue-200">{{ user && (user.is_admin ? 'Administrador' : 'Usuário') }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <img :src="avatarUrl" class="w-10 h-10 rounded-full border-2 border-blue-700 cursor-pointer" alt="avatar" @click="showProfile = true" />
          <Modal :show="showProfile" @close="showProfile = false">
            <div v-if="user">
              <h3 class="text-xl font-bold text-blue-200 mb-2">{{ user.name }}</h3>
              <p class="text-blue-400 mb-1">Email: <span class="text-blue-100">{{ user.email }}</span></p>
              <p class="text-blue-400 mb-1">
                Tipo: <span class="text-blue-100">{{ user.is_admin ? 'Administrador' : 'Usuário' }}</span>
              </p>
              <p class="text-blue-400 mb-1">ID: <span class="text-blue-100">{{ user.id }}</span></p>
            </div>
          </Modal>
        </div>
      </header>
      <main class="flex-1 p-8 bg-gray-600">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import Modal from './Modal.vue'
export default {
  components: { Modal },
  data() {
    return {
      showProfile: false
    }
  },
  computed: {
    user() {
      return JSON.parse(localStorage.getItem('user'))
    },
    isAdmin() {
      return this.user && this.user.is_admin
    },
    avatarUrl() {
      if (!this.user) return ''
      const initials = this.user.name.split(' ').map(n => n[0]).join('').toUpperCase()
      return `https://ui-avatars.com/api/?name=${initials}&background=0D8ABC&color=fff`
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script> 