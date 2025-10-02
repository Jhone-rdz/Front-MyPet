import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Agendamentos from './Agendamentos'; // ou crie um componente específico

const NovoAgendamento = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const petId = searchParams.get('pet');

  return (
    <div>
      <Agendamentos 
        petPreSelecionado={petId}
        onClose={() => navigate('/agendamentos')}
      />
    </div>
  );
};

export default NovoAgendamento;
