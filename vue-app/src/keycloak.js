import Keycloak from 'keycloak-js'

// Configurações do Keycloak usando variáveis de ambiente
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
});

// Adiciona uma propriedade para verificar se o Keycloak está inicializado
keycloak.initialized = false;

export default keycloak;