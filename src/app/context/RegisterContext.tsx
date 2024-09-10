import React, { createContext, useState, ReactNode, useContext } from 'react';

export type RegisterData = {
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
};

export type RegisterContextType = {
  registerData: RegisterData;
  setRegisterData: React.Dispatch<React.SetStateAction<RegisterData>>;
  updateField: (field: keyof RegisterData, value: string) => void;
};

const initialRegisterData: RegisterData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  endereco: '',
  compl: '',
  bairro: '',
  cidade: '',
  uf: '',
  cep: '',
};

export const RegisterContext = createContext<RegisterContextType | undefined>(undefined);

export const RegisterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [registerData, setRegisterData] = useState<RegisterData>(initialRegisterData);

  const updateField = (field: keyof RegisterData, value: string) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <RegisterContext.Provider value={{ registerData, setRegisterData, updateField }}>
      {children}
    </RegisterContext.Provider>
  );
};

export const useRegister = (): RegisterContextType => {
  const context = useContext(RegisterContext);
  if (context === undefined) {
    throw new Error('useRegister must be used within a RegisterProvider');
  }
  return context;
};
