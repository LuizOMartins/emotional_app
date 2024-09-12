import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const authContext = useContext(AuthContext);  // Verificar o contexto antes de acessar
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula atraso de 500ms
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading || authContext === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  return <AppNavigator isAuthenticated={!!authContext.isAuthenticated} />;  // Garantir que o contexto existe antes de acessar
}
