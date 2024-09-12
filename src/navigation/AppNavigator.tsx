import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import * as React from 'react';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface AppNavigatorProps {
    isAuthenticated: boolean;
}

export default function AppNavigator({ isAuthenticated }: AppNavigatorProps) {
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
