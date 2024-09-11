import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useContext } from 'react';
import { RootStackParamList } from '../navigation/AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import GraficoHistoricoAvaliacoes from '../components/GraficoHistoricoAvaliacoes';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';
// import ModalFormularioAvaliacaoPositiva from '../components/modals/ModalFormularioAvaliacaoPositiva';
// import ModalFormularioAvaliacaoNegativa from '../components/modals/ModalFormularioAvaliacaoNegativa';


type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomePage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [avaliacoesPositivas, setAvaliacoesPositivas] = useState([]);
    const [avaliacoesNegativas, setAvaliacoesNegativas] = useState([]);
    const [isFormDisabledPositiva, setIsFormDisabledPositiva] = useState(false);
    const [isFormDisabledNegativa, setIsFormDisabledNegativa] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [mensagemPositiva, setMensagemPositiva] = useState('');
    const [mensagemNegativa, setMensagemNegativa] = useState('');
    const [isModalPositivoOpen, setIsModalPositivoOpen] = useState(false);
    const [isModalNegativoOpen, setIsModalNegativoOpen] = useState(false);

    const navigation = useNavigation<NavigationProps>();


    const { logout } = useContext(AuthContext); // Use o contexto para gerenciar logout

    // Verificar se o usuário está autenticado
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                navigation.navigate('Login');
                return;
            }

            try {
                const decodedToken = JSON.parse(atob(token.split('.')[1]));
                setUserId(decodedToken.id);
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                navigation.navigate('Login');
            }
        };

        checkToken();
    }, [navigation]);

    // Buscar avaliações
    const fetchAvaliacoes = async () => {
        try {
            setIsLoading(true);

            const responsePositivas = await axios.get('http://200.98.81.153:8081/api/avaliacoes/positiva');
            setAvaliacoesPositivas(responsePositivas.data.data);

            const hoje = new Date().toISOString().split('T')[0];
            const existeAvaliacaoPositivaHoje = responsePositivas.data.data.some(
                (avaliacao) => avaliacao.dataAvaliacao === hoje && avaliacao.userId === userId
            );
            setIsFormDisabledPositiva(existeAvaliacaoPositivaHoje);
            if (existeAvaliacaoPositivaHoje) {
                setMensagemPositiva('Avaliação Positiva diária feita com sucesso!');
            }

            const responseNegativas = await axios.get('http://200.98.81.153:8081/api/avaliacoes/negativa');
            setAvaliacoesNegativas(responseNegativas.data.data);

            const existeAvaliacaoNegativaHoje = responseNegativas.data.data.some(
                (avaliacao) => avaliacao.dataAvaliacao === hoje && avaliacao.userId === userId
            );
            setIsFormDisabledNegativa(existeAvaliacaoNegativaHoje);
            if (existeAvaliacaoNegativaHoje) {
                setMensagemNegativa('Avaliação Negativa diária feita com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao buscar avaliações:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchAvaliacoes();
        }
    }, [userId]);

    const handlePositiveSubmit = async (formData: any) => {
        try {
            const response = await axios.post('http://200.98.81.153:8081/api/avaliacoes/positiva', formData);
            if (response.status === 201) {
                Alert.alert('Sucesso', 'Avaliação positiva enviada com sucesso!');
                fetchAvaliacoes();
                setIsModalPositivoOpen(false);
            } else {
                Alert.alert('Erro', 'Erro ao enviar avaliação');
            }
        } catch (error) {
            console.error('Erro ao enviar a avaliação:', error);
            Alert.alert('Erro', 'Erro ao enviar avaliação');
        }
    };

    const handleNegativeSubmit = async (formData: any) => {
        try {
            const response = await axios.post('http://200.98.81.153:8081/api/avaliacoes/negativa', formData);
            if (response.status === 201) {
                Alert.alert('Sucesso', 'Avaliação negativa enviada com sucesso!');
                fetchAvaliacoes();
                setIsModalNegativoOpen(false);
            } else {
                Alert.alert('Erro', 'Erro ao enviar avaliação negativa');
            }
        } catch (error) {
            console.error('Erro ao enviar a avaliação negativa:', error);
            Alert.alert('Erro', 'Erro ao enviar avaliação negativa');
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Buscando Avaliações...</Text>
                </View>
            ) : (
                <View>
                    <View style={styles.buttonContainer}>
                        {!isFormDisabledPositiva ? (
                            <Button title="Fazer Avaliação Positiva" onPress={() => setIsModalPositivoOpen(true)} color="#007bff" />
                        ) : (
                            <Text style={styles.successText}>{mensagemPositiva}</Text>
                        )}

                        {!isFormDisabledNegativa ? (
                            <Button title="Fazer Avaliação Negativa" onPress={() => setIsModalNegativoOpen(true)} color="#ff4d4d" />
                        ) : (
                            <Text style={styles.successText}>{mensagemNegativa}</Text>
                        )}
                    </View>

                    {/* Modal de Avaliação Positiva */}
                    <ModalFormularioAvaliacaoPositiva
                        visible={isModalPositivoOpen}
                        onClose={() => setIsModalPositivoOpen(false)}
                        onSubmit={handlePositiveSubmit}
                    />

                    {/* Modal de Avaliação Negativa */}
                    <ModalFormularioAvaliacaoNegativa
                        visible={isModalNegativoOpen}
                        onClose={() => setIsModalNegativoOpen(false)}
                        onSubmit={handleNegativeSubmit}
                    />

                    <GraficoHistoricoAvaliacoes userId={userId} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    successText: {
        color: 'green',
        fontSize: 16,
        textAlign: 'center',
    },
});
