import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import keycloak from '../keycloak'

// Define as rotas
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true } // Adiciona meta para rotas que não requerem autenticação
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { requiresAuth: true } // Adiciona meta para rotas que requerem autenticação
  }
]

// Cria o roteador
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_URL),
  routes
})

// Adiciona o guardião de navegação
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifica se o usuário está autenticado  
    if (keycloak.authenticated) {
      next()
    } else {
      // Redireciona para o login se não estiver autenticado
      keycloak.login()
    }
  } else {
    next()
  }
})

export default router
