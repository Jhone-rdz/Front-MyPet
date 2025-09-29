// Funções auxiliares para formatação de dados
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR');
};

export const getEspecieName = (especieCode) => {
  const especies = {
    'C': 'Cachorro',
    'G': 'Gato', 
    'O': 'Outro'
  };
  return especies[especieCode] || 'Desconhecido';
};

export const getStatusBadgeVariant = (status) => {
  const variants = {
    agendado: 'warning',
    confirmado: 'success',
    cancelado: 'danger',
    concluido: 'info'
  };
  return variants[status] || 'secondary';
};