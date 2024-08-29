import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import KeycloakService from '@/services/KeycloakService'


const app = createApp(App)

KeycloakService.keycloakStart()
  .then(() => {
    app.use(createPinia());
    app.use(router);
    app.mount('#app');
  })
  .catch((error) => {
    console.error('Failed to start Keycloak:', error);
    // Aqui você pode adicionar lógica para redirecionar para uma página de erro ou outra ação
  });
