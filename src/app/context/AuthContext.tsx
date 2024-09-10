import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  status: boolean;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ user: User; token: string }>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  completeRegistration: (userId: string, userData: any) => Promise<void>;
  getUser: (userId: string) => Promise<User>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

const API_URL = 'http://192.168.1.2:3333'; // URL base da API

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with email:', email);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      
      if (response.ok && data.token && data.user) {
        await AsyncStorage.setItem('authToken', data.token);
        setUser(data.user);
        setIsAuthenticated(true);
        
        // Fetch additional user data if needed
        const userData = await getUser(data.user.id);
        console.log('Additional user data:', userData);
        
        return { user: userData, token: data.token };
      } else {
        throw new Error('Credenciais inválidas.');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Erro ao registrar.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    }
  };

  const completeRegistration = async (userId: string, userData: any) => {
    try {
      const response = await fetch(`${API_URL}/complete-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...userData }),
      });
      if (!response.ok) {
        throw new Error('Erro ao completar registro.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao completar registro:', error);
      throw error;
    }
  };

  const getUser = async (userId: string) => {
    try {
      console.log('Fetching user data for ID:', userId);
      const response = await fetch(`${API_URL}/user/${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Erro ao buscar usuário.');
      }
      console.log('User data response:', data);
      return data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  };

  const verifyToken = async () => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch(`${API_URL}/verify-token`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Token inválido ou erro ao verificar token.');
        }
        console.log('Token verification response:', data);
        setUser(data.decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token inválido ou erro ao verificar token:', error);
        await logout();
      }
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      logout, 
      register, 
      completeRegistration, 
      getUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
