import axios from 'axios';
import { authService } from './auth';

const API_BASE_URL = 'https://petshop-backend-f4nc.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, 
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`Response received: ${response.status} ${response.statusText}`);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
    } else if (error.request) {
      // A request foi feita mas não houve resposta
      console.error('No response received:', error.request);
      
      if (error.code === 'ECONNREFUSED') {
        throw new Error('Servidor não está respondendo. Verifique se o backend está rodando.');
      } else if (error.code === 'NETWORK_ERROR') {
        throw new Error('Erro de rede. Verifique sua conexão.');
      }
    } else {
      // Algum outro erro ocorreu
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const clienteService = {
  getAll: () => api.get('/clientes/'),
  getById: (id) => api.get(`/clientes/${id}/`),
  create: (data) => api.post('/clientes/', data),
  update: (id, data) => api.put(`/clientes/${id}/`, data),
  delete: (id) => api.delete(`/clientes/${id}/`),
};

export const petService = {
  getAll: () => api.get('/pets/'),
  getById: (id) => api.get(`/pets/${id}/`),
  create: (data) => api.post('/pets/', data),
  update: (id, data) => api.put(`/pets/${id}/`, data),
  delete: (id) => api.delete(`/pets/${id}/`),
};

export const servicoService = {
  getAll: () => api.get('/servicos/'),
  getById: (id) => api.get(`/servicos/${id}/`),
  create: (data) => api.post('/servicos/', data),
  update: (id, data) => api.put(`/servicos/${id}/`, data),
  delete: (id) => api.delete(`/servicos/${id}/`),
};

export const agendamentoService = {
  getAll: () => api.get('/agendamentos/'),
  getById: (id) => api.get(`/agendamentos/${id}/`),
  create: (data) => api.post('/agendamentos/', data),
  update: (id, data) => api.put(`/agendamentos/${id}/`, data),
  delete: (id) => api.delete(`/agendamentos/${id}/`),
  getHorariosDisponiveis: (data, servicoId) => 
    api.get(`/agendamentos/horarios_disponiveis/?data=${data}&servico_id=${servicoId}`),
  confirmar: (id) => api.post(`/agendamentos/${id}/confirmar/`),
  cancelar: (id) => api.post(`/agendamentos/${id}/cancelar/`),
  concluir: (id) => api.post(`/agendamentos/${id}/concluir/`),
  hoje: () => api.get('/agendamentos/hoje/'),
  proximos: () => api.get('/agendamentos/proximos/'),
};

export default api;