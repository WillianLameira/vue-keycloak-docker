import Keycloak from 'keycloak-js';

class KeycloakService {
  constructor() {
    this.keycloakInstance = new Keycloak({
      realm: import.meta.env.VITE_APP_KEYCLOAK_REALM,
      url: import.meta.env.VITE_APP_KEYCLOAK_URL,
      clientId: import.meta.env.VITE_APP_KEYCLOAK_CLIENT_ID,
    });
  }

  // Método para inicializar o Keycloak
  async initKeycloak() {
    try {
      await this.keycloakInstance.init({
        onLoad: 'login-required',
        checkLoginIframe: false
      });
      console.log('Keycloak initialized');
      return true;
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      return false;
    }
  }

  logoutFromClient() {
    return this.keycloakInstance.logout({
      redirectUri: import.meta.env.APP_BASE_URL_FRONTEND
    });
  }

  async getUserProfile() {
    console.log('Loading user profile...');
    const profile = await this.keycloakInstance.loadUserProfile();
    console.log('User profile loaded:', profile);
    return profile;
  }

  async getCompleteName() {
    const profile = await this.getUserProfile();
    const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
    console.log('Full name:', fullName);
    return fullName;
  }

  async getUsername() {
    const profile = await this.getUserProfile();
    const username = profile.username || '';
    console.log('Username:', username);
    return username;
  }

  userHasRoles(roles) {
    return roles.every(role => this.getActualRoles().includes(role));
  }

  updateToken() {
    return this.keycloakInstance.updateToken(5); // Atualiza token se estiver para expirar em 5 segundos
  }

  getActualRoles() {
    const backendClient = import.meta.env.APP_KEYCLOAK_BACKEND_CLIENT_ID;
    return this.keycloakInstance.resourceAccess?.[backendClient]?.roles ?? [];
  }

  getKeycloakToken() {
    return this.keycloakInstance.token || '';
  }

  keycloakStart() {
    return new Promise((resolve, reject) => {
      try {
        this.keycloakInstance.onTokenExpired = async () => {
          const refreshed = await this.updateToken();
          console.log(refreshed ? 'Token was refreshed' : 'Token is still valid');
        };
        
        this.keycloakInstance.onAuthSuccess = () => {
          console.log('Authenticated!');
          resolve(); // Resolve a promessa quando a autenticação for bem-sucedida
        };
  
        this.keycloakInstance.onAuthError = (error) => {
          console.error('Failed to authenticate:', error);
          reject(error); // Rejeita a promessa se houver um erro de autenticação
        };
  
        // Inicializa o Keycloak (pode mover para initKeycloak() se preferir)
        this.initKeycloak().then(resolve).catch(reject);
  
      } catch (error) {
        console.error('Failed to initialize adapter:', error);
        reject(error); // Rejeita a promessa em caso de erro
      }
    });
  }
}

export default new KeycloakService();
