import axios from 'axios';

// Função para obter o token do Keycloak
const getToken = () => {
  return localStorage.getItem('vue-token');
};

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // URL da sua API Laravel
  headers: {
    'Authorization': `Bearer ${getToken()}`
  }
});

// Adicione um interceptor para atualizar o token se necessário
api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
