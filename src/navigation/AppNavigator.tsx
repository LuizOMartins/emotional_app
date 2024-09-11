import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isAuthenticated } = useContext(AuthContext);  // Pegar estado de autenticação

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isAuthenticated ? "Home" : "Login"}>
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
