import axios from 'axios';

const API_BASE_URL = 'https://petshop-backend-f4nc.onrender.com';

export const authService = {
  login: (credentials) => 
    axios.post(`${API_BASE_URL}/auth/login/`, credentials),
  
  register: (userData) => 
    axios.post(`${API_BASE_URL}/auth/register/`, userData),
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },
  
  setToken: (token) => {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  getToken: () => localStorage.getItem('token'),
  
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Configurar token automaticamente se existir
const token = authService.getToken();
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}