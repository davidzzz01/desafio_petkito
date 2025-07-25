<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-blue-900">Usuários</h2>
      <div class="flex items-center space-x-2 mb-2">
        <input
          v-model="search"
          @input="fetchUsers"
          placeholder="Buscar usuário..."
          class="border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          v-model="roleFilter"
          @change="fetchUsers"
          class="border border-blue-700 bg-gray-100 text-gray-800 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todos</option>
          <option value="admin">Admin</option>
          <option value="user">Usuário</option>
        </select>
      </div>
      <div v-if="!filteredUsers.length" class="text-center text-blue-400 py-8">
        Nenhum usuário encontrado.
      </div>
      <table v-else class="w-full rounded-lg shadow text-gray-800 overflow-hidden">
        <thead>
          <tr class="bg-blue-900 text-white">
            <th class="py-3 px-4 text-left font-semibold">Nome</th>
            <th class="py-3 px-4 text-left font-semibold">Email</th>
            <th class="py-3 px-4 text-left font-semibold">Tipo</th>
            <th class="py-3 px-4 text-left font-semibold" v-if="isAdmin">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="bg-white hover:bg-blue-50 transition"
          >
            <td class="py-2 px-4">{{ user.name }}</td>
            <td class="py-2 px-4">{{ user.email }}</td>
            <td class="py-2 px-4">{{ user.is_admin ? 'Administrador' : 'Usuário' }}</td>
            <td class="py-2 px-4" v-if="isAdmin">
              <button @click="openModal(user)" class="text-blue-600 hover:text-blue-800 mr-2" title="Ver detalhes">
                <i class="fas fa-eye"></i>
              </button>
              <router-link :to="`/users/${user.id}/edit`" class="text-green-600 hover:text-green-800 mr-2" title="Editar">
                <i class="fas fa-edit"></i>
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
      <Modal :show="showModal && isAdmin" @close="showModal = false">
        <div v-if="selectedUser">
          <h3 class="text-xl font-bold text-blue-900 mb-2">{{ selectedUser.name }}</h3>
          <p class="text-blue-600 mb-1">Email: <span class="text-blue-900">{{ selectedUser.email }}</span></p>
          <p class="text-blue-600 mb-1">Tipo: <span class="text-blue-900">{{ selectedUser.is_admin ? 'Administrador' : 'Usuário' }}</span></p>
          <p class="text-blue-600 mb-1">ID: <span class="text-blue-900">{{ selectedUser.id }}</span></p>
        </div>
      </Modal>
    </div>
  </AppLayout>
</template>

<script>
import AppLayout from '../components/AppLayout.vue'
import Modal from '../components/Modal.vue'
import api from '../services/api'

export default {
  components: { AppLayout, Modal },
  data() {
    return {
      users: [],
      showModal: false,
      selectedUser: null,
      search: '',
      roleFilter: ''
    }
  },
  computed: {
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'))
      return user && user.is_admin
    },
    filteredUsers() {
      let users = this.users
      if (this.search) {
        users = users.filter(u => u.name.toLowerCase().includes(this.search.toLowerCase()))
      }
      if (this.roleFilter) {
        users = users.filter(u => u.role === this.roleFilter)
      }
      return users
    }
  },
  methods: {
    async fetchUsers() {
      const { data } = await api.get('/users')
      this.users = data
    },
    openModal(user) {
      if (this.isAdmin) {
        this.selectedUser = user
        this.showModal = true
      }
    }
  },
  mounted() {
    this.fetchUsers()
  }
}
</script> 