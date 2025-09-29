import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { authService } from './services/auth';

// Components
import Login from './components/Login';
import NavigationBar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import ClienteDetail from './components/ClienteDetail';
import ClienteForm from './components/ClienteForm';
import Pets from './components/Pets';
import PetDetail from './components/PetDetail';
import PetForm from './components/PetForm';
import Agendamentos from './components/Agendamentos';
import Servicos from './components/Servicos';

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

// Componente para rotas públicas (quando já está autenticado)
const PublicRoute = ({ children }) => {
  return !authService.isAuthenticated() ? children : <Navigate to="/" />;
};

function App() {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <NavigationBar />}
        <div className={isAuthenticated ? "container mt-4" : ""}>
          <Routes>
            {/* Rotas públicas */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />

            {/* Rotas protegidas */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <Clientes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes/novo" 
              element={
                <ProtectedRoute>
                  <ClienteForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes/editar/:id" 
              element={
                <ProtectedRoute>
                  <ClienteForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes/:id" 
              element={
                <ProtectedRoute>
                  <ClienteDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets" 
              element={
                <ProtectedRoute>
                  <Pets />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets/novo" 
              element={
                <ProtectedRoute>
                  <PetForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets/editar/:id" 
              element={
                <ProtectedRoute>
                  <PetForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pets/:id" 
              element={
                <ProtectedRoute>
                  <PetDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos" 
              element={
                <ProtectedRoute>
                  <Agendamentos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/servicos" 
              element={
                <ProtectedRoute>
                  <Servicos />
                </ProtectedRoute>
              } 
            />

            {/* Rota padrão */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;