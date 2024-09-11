import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import React, { useState, useContext } from 'react';
import axios from 'axios';



type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginPage() {
    const navigation = useNavigation<NavigationProps>();


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const application = 'emotional';
    const { login } = useContext(AuthContext);

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://200.98.81.153:8081/api/auth/login', {
                email,
                password,
                application,
            });

            if (response.status === 200) {
                // Usa a função login do contexto e passa o token
                login(response.data.token);

                // Redireciona para a página Home após o login bem-sucedido
                Alert.alert('Sucesso', 'Logou');
                // navigation.navigate('Register'); // Redireciona para a página 'Home'
            } else {
                setError('Credenciais inválidas');
            }
        } catch (error) {
            console.error('Falha no login:', error);
            setError('Falha no login. Verifique suas credenciais.');
            Alert.alert('Erro', 'Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Login</Text>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                <Button title="Login" onPress={handleSubmit} />
                <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerText}>Registre-se</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    form: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
        width: '80%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        width: '100%',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    registerButton: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    registerText: {
        color: '#fff',
        fontSize: 16,
    },
});
