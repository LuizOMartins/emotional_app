import React, { useContext, useEffect, useState } from 'react';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ActivityIndicator, View } from 'react-native';

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular um tempo para carregar a autenticação
    const checkAuth = async () => {
      // Supondo que a autenticação esteja carregando inicialmente
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simular atraso de 500ms
      setLoading(false); // Simulação da finalização do carregamento
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator isAuthenticated={isAuthenticated} />;
}
