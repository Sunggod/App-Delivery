import axios from 'axios';

// Configura o axios com a URL base da API
export const api = axios.create({
  baseURL: 'http://192.168.1.2:3333', // Use o IP do seu computador
});

// Função para listar todos os clientes
export const listCustomers = async () => {
  try {
    const response = await api.get('/customers');
    return response.data;
  } catch (error) {
    console.error('Erro ao listar clientes:', error);
    throw error;
  }
};

// Função para excluir um cliente pelo ID
export const deleteCustomer = async (id: string) => {
  try {
    const response = await api.delete(`/customer/${id}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao excluir cliente:', error);
    throw error;
  }
};

// Função para fazer login
export const login = async (data: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post('/login', data);
    return response.data; // Retorna o token JWT
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};
