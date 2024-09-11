import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Função para verificar autenticação ao carregar o aplicativo
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkToken();
  }, []);

  // Função de login
  const login = async (token) => {
    try {
      await AsyncStorage.setItem('token', token);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao salvar o token no AsyncStorage", error);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao remover o token do AsyncStorage", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
