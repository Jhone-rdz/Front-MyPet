import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavigationBar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import ClienteDetail from './components/ClienteDetail';
import ClienteForm from './components/ClienteForm';
import Pets from './components/Pets';
import PetDetail from './components/PetDetail';
import PetForm from './components/PetForm';
import Agendamentos from './components/Agendamentos';
import AgendamentoDetail from './components/AgendamentoDetail';
import Servicos from './components/Servicos';
import ServicoDetail from './components/ServicoDetail';
import ServicoForm from './components/ServicoForm';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <Router>
      <div className="App">
        {isAuthenticated && <NavigationBar />}
        <div className={isAuthenticated ? "container mt-4" : ""}>
          <Routes>
            {/* Rota pública de login */}
            <Route 
              path="/login" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Login />
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
            
            {/* Rotas de Clientes */}
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
            
            {/* Rotas de Pets */}
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
            
            {/* Rotas de Agendamentos */}
            <Route 
              path="/agendamentos" 
              element={
                <ProtectedRoute>
                  <Agendamentos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos/novo" 
              element={
                <ProtectedRoute>
                  <Agendamentos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/agendamentos/:id" 
              element={
                <ProtectedRoute>
                  <AgendamentoDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Rotas de Serviços */}
            <Route 
              path="/servicos" 
              element={
                <ProtectedRoute>
                  <Servicos />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/servicos/novo" 
              element={
                <ProtectedRoute>
                  <ServicoForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/servicos/editar/:id" 
              element={
                <ProtectedRoute>
                  <ServicoForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/servicos/:id" 
              element={
                <ProtectedRoute>
                  <ServicoDetail />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirecionar para login se não autenticado, ou dashboard se autenticado */}
            <Route 
              path="*" 
              element={
                isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
              } 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;