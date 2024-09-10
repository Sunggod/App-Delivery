import axios from 'axios';

// Atualize a URL conforme necessário
const API_URL = 'http://localhost:3333'; // Ajuste a URL base conforme a configuração do seu backend

// Função para concluir o registro
export const completeRegistration = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  endereco: string;
  compl: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/complete-register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Manipule a resposta conforme necessário
    return response.data;
  } catch (error) {
    // Lida com o erro de maneira adequada
    console.error('Erro ao concluir o registro:', error);
    throw new Error('Falha ao concluir o registro. Tente novamente.');
  }
};

// Função de registro inicial, se necessário
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw new Error('Falha ao registrar. Tente novamente.');
  }
};
