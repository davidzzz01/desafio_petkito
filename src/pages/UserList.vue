<template>
  <AppLayout>
    <div class="max-w-5xl mx-auto">
      <h2 class="text-2xl font-bold mb-4 text-blue-900">Usuários</h2>
      <div class="flex items-center space-x-2 mb-2">
        <span class="text-blue-900">Total: <b>{{ paginationInfo.total }}</b> usuários</span>
      </div>
      <div v-if="!users.length" class="text-center text-blue-400 py-8">
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
            v-for="user in users"
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
      
      <div v-if="users.length > 0" class="flex items-center justify-between mt-6">
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
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'))
      return user && user.is_admin
    },
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
    async fetchUsers(page = 1) {
      try {
        const params = {
          page,
          per_page: 10
        }
        
        const response = await api.get('/users', { params })
        
        this.users = response.data.data || []
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
        console.error('Erro ao buscar usuários:', error)
        this.users = []
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
      this.fetchUsers(page)
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