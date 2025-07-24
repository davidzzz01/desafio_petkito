import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import NotFound from '../pages/NotFound.vue'
import UserCreate from '../pages/UserCreate.vue'
import UserEdit from '../pages/UserEdit.vue'
import UserList from '../pages/UserList.vue'
import TaskCreate from '../pages/TaskCreate.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/users', component: UserList, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/users/create', component: UserCreate, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/users/:id/edit', component: UserEdit, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/tasks/create', component: TaskCreate, meta: { requiresAuth: true, adminOnly: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.adminOnly && (!user || !user.is_admin)) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 