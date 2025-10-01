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
import Servicos from './components/Servicos';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/novo" element={<ClienteForm />} />
            <Route path="/clientes/editar/:id" element={<ClienteForm />} />
            <Route path="/clientes/:id" element={<ClienteDetail />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/novo" element={<PetForm />} />
            <Route path="/pets/editar/:id" element={<PetForm />} />
            <Route path="/pets/:id" element={<PetDetail />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/agendamentos/novo" element={<Agendamentos />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
