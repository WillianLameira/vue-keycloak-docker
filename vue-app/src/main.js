import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import keycloak from './keycloak'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// Função para iniciar o Keycloak e montar o aplicativo
const initializeApp = async () => {
  try {
    // Inicializa o Keycloak
    await new Promise((resolve, reject) => {
      keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
        
        if (authenticated) {
          localStorage.setItem('vue-token', keycloak.token);
          localStorage.setItem('vue-refresh-token', keycloak.refreshToken);
          localStorage.setItem('user-logging', true);
          keycloak.initialized = true;
          resolve();
        } else {
          reject('Keycloak not authenticated');
        }
        
      }).catch(reject);
    });

    if (keycloak.initialized) {
      // Agora o Keycloak está inicializado e autenticado
      app.mount('#app');
      console.log(keycloak.token);
      //Atualiza o token periodicamente
      setInterval(() => {
        keycloak.updateToken(70).then(refreshed => {
          if (refreshed) {
            localStorage.setItem('vue-token', keycloak.token);
            localStorage.setItem('vue-refresh-token', keycloak.refreshToken);
          }
        }).catch(error => {
          console.error('Failed to refresh token', error);
        });
      }, 60000);
    }
  } catch (error) {
    console.error('Failed to initialize Keycloak', error);
  }
};

// Inicia o aplicativo
initializeApp();
