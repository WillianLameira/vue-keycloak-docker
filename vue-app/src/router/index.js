import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import KeycloakService from '@/services/KeycloakService'

// Define as rotas
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiredPermissions: [] } // Adicione permissões necessárias aqui
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { requiredPermissions: [] } // Adicione permissões necessárias aqui
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter: (to, from, next) => {
      // Chama o serviço de logout
      KeycloakService.logoutFromClient()
      next('/') // Redireciona para a página inicial após o logout
    }
  }
]

// Cria o roteador
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})

// Middleware de navegação para verificar permissões
router.beforeEach(async (to, from, next) => {
  const userHasRoles = KeycloakService.userHasRoles(to.meta.requiredPermissions || [])
  if (to.meta.requiredPermissions && !userHasRoles) {
    next({ name: from.name || 'home' }) // Redireciona se não tiver permissões
  } else {
    next()
  }
})

export default router
