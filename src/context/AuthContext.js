import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criação do contexto sem tipos, já que estamos usando JavaScript
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token); // Se o token existir, autentica
    };
    checkToken();
  }, []);

  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true); // Autentica o usuário ao fazer login
    } catch (error) {
      console.error('Erro ao salvar o token no AsyncStorage', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false); // Desloga o usuário ao remover o token
    } catch (error) {
      console.error('Erro ao remover o token do AsyncStorage', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
