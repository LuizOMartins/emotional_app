import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import { View, Text } from 'react-native';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Splash: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
    isAuthenticated: boolean | null; // Permite o estado de carregamento ser null
}

export default function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
    if (isAuthenticated === null) {
        // Retorna um indicador de carregamento ou tela de splash enquanto verifica a autenticação
        return (
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="Splash" component={() => <SplashScreen />} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isAuthenticated ? 'Home' : 'Login'}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login" component={LoginPage} />
                        <Stack.Screen name="Register" component={RegisterPage} />
                    </>
                ) : (
                    <Stack.Screen name="Home" component={HomePage} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

// Exemplo simples de tela de Splash (substitua com algo mais apropriado, se necessário)
function SplashScreen() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Carregando...</Text>
        </View>
    );
}
