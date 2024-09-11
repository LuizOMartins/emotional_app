import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainerProps, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';


type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterPage() {
    const navigation = useNavigation<NavigationProps>();
    const [step, setStep] = useState(1); // Controla a etapa atual
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [passwordError, setPasswordError] = useState(''); // Erro de validação da senha
    const [application] = useState('my-app'); // Aplicação padrão

    // Validação da senha
    const validatePassword = (password: string) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        if (password.length < minLength) {
            setPasswordError('A senha deve ter pelo menos 8 caracteres');
        } else if (!hasUpperCase) {
            setPasswordError('A senha deve conter pelo menos uma letra maiúscula');
        } else if (!hasLowerCase) {
            setPasswordError('A senha deve conter pelo menos uma letra minúscula');
        } else if (!hasNumbers) {
            setPasswordError('A senha deve conter pelo menos um número');
        } else if (!hasSpecialChar) {
            setPasswordError('A senha deve conter pelo menos um caractere especial');
        } else {
            setPasswordError('');
        }
    };

    // Função de registro
    const handleRegister = async () => {
        if (passwordError) return; // Não permite submissão se a senha for inválida

        try {
            const response = await axios.post('http://200.98.81.153:8081/api/auth/register', {
                name,
                email,
                password,
                application,
            });

            if (response.status === 201) {
                setStep(2); // Avança para a etapa de verificação
            } else {
                setError('Erro ao cadastrar. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro no registro:', error);
            setError('Falha no registro. Verifique seus dados.');
        }
    };

    // Função de verificação do código
    const handleVerifyCode = async () => {
        try {
            const response = await axios.post('http://200.98.81.153:8081/api/auth/verify-email', {
                email,
                application,
                verificationCode,
            });

            if (response.status === 200) {
                setStep(3); // Avança para a etapa final
            } else {
                setError('Código de verificação inválido.');
            }
        } catch (error) {
            console.error('Erro na verificação:', error);
            setError('Falha na verificação. Tente novamente.');
        }
    };

    // Função de redirecionamento ao login
    const handleLoginRedirect = () => {
        navigation.navigate('Login'); // Redireciona para a página de login
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                {error && <Text style={styles.errorText}>{error}</Text>}

                {/* Barra de Etapas */}
                <View style={styles.stepBar}>
                    <Text style={[styles.stepText, step >= 1 ? styles.activeStep : styles.inactiveStep]}>Etapa 1: Cadastro</Text>
                    <Text style={[styles.stepText, step >= 2 ? styles.activeStep : styles.inactiveStep]}>Etapa 2: Verificação</Text>
                    <Text style={[styles.stepText, step >= 3 ? styles.activeStep : styles.inactiveStep]}>Etapa 3: Conclusão</Text>
                </View>

                {/* Progresso visual */}
                <View style={styles.progressBar}>
                    <View style={[styles.progress, { width: `${(step / 3) * 100}%` }]} />
                </View>

                {/* Etapa 1: Cadastro de Email e Senha */}
                {step === 1 && (
                    <>
                        <TextInput
                            placeholder="Nome Completo"
                            value={name}
                            onChangeText={setName}
                            style={styles.input}
                        />
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
                            onChangeText={(text) => {
                                setPassword(text);
                                validatePassword(text); // Valida a senha enquanto o usuário digita
                            }}
                            style={styles.input}
                            secureTextEntry
                        />
                        {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
                        <Button title="Registrar" onPress={handleRegister} disabled={!!passwordError} />
                    </>
                )}

                {/* Etapa 2: Verificação do Código */}
                {step === 2 && (
                    <>
                        <TextInput
                            placeholder="Código de Verificação"
                            value={verificationCode}
                            onChangeText={setVerificationCode}
                            style={styles.input}
                        />
                        <Button title="Verificar Código" onPress={handleVerifyCode} />
                    </>
                )}

                {/* Etapa 3: Acesso ao Menu */}
                {step === 3 && (
                    <View style={styles.successContainer}>
                        <Text style={styles.successText}>Cadastro Completo!</Text>
                        <TouchableOpacity style={styles.menuButton} onPress={handleLoginRedirect}>
                            <Text style={styles.menuButtonText}>Acessar Menu</Text>
                        </TouchableOpacity>
                    </View>
                )}
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
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 12,
        width: '100%',
    },
    stepBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    stepText: {
        fontSize: 16,
    },
    activeStep: {
        fontWeight: 'bold',
        color: '#1E90FF',
    },
    inactiveStep: {
        color: '#ccc',
    },
    progressBar: {
        height: 4,
        backgroundColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
    },
    progress: {
        height: '100%',
        backgroundColor: '#1E90FF',
        borderRadius: 8,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    successContainer: {
        alignItems: 'center',
    },
    successText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    menuButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    menuButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
