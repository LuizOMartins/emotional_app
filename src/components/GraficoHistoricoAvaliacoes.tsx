import api from '../utils/axiosInstance';
import { Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function GraficoHistoricoAvaliacoes({ userId }) {
    const [historicoPositivo, setHistoricoPositivo] = useState([]);
    const [historicoNegativo, setHistoricoNegativo] = useState([]);
    const [selectedChart, setSelectedChart] = useState('positivo');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    // Definir busca padrão para os últimos 7 dias
    useEffect(() => {
        const hoje = new Date();
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(hoje.getDate() - 7);

        setDataFim(hoje.toISOString().split('T')[0]); // Define data fim como hoje
        setDataInicio(seteDiasAtras.toISOString().split('T')[0]); // Define data início como 7 dias atrás
    }, []);

    // Função para buscar o histórico de avaliações positivas
    const fetchHistoricoPositivo = async () => {
        try {
            const response = await api.get(`/avaliacoes/positiva?dataInicio=${dataInicio}&dataFim=${dataFim}`);
            setHistoricoPositivo(response.data.data || []); // Garante que sempre será um array
        } catch (error) {
            console.error('Erro ao buscar o histórico de avaliações positivas:', error);
        }
    };

    // Função para buscar o histórico de avaliações negativas
    const fetchHistoricoNegativo = async () => {
        try {
            const response = await api.get(`/avaliacoes/negativa?dataInicio=${dataInicio}&dataFim=${dataFim}`);
            setHistoricoNegativo(response.data.data || []); // Garante que sempre será um array
        } catch (error) {
            console.error('Erro ao buscar o histórico de avaliações negativas:', error);
        }
    };

    // Fetch histórico de ambas as avaliações ao carregar ou ao alterar as datas
    useEffect(() => {
        if (dataInicio && dataFim) {
            fetchHistoricoPositivo();
            fetchHistoricoNegativo();
        }
    }, [dataInicio, dataFim]);

    // Preparar os dados para o gráfico com base no tipo selecionado
    const prepareChartData = () => {
        const labels = selectedChart === 'positivo'
            ? (historicoPositivo.length > 0 ? historicoPositivo.map((avaliacao) => avaliacao.dataAvaliacao) : [])
            : (historicoNegativo.length > 0 ? historicoNegativo.map((avaliacao) => avaliacao.dataAvaliacao) : []);

        const datasets = selectedChart === 'positivo'
            ? [
                {
                    data: historicoPositivo.map((avaliacao) => avaliacao.fe),
                    strokeWidth: 2, // optional
                },
            ]
            : [
                {
                    data: historicoNegativo.map((avaliacao) => avaliacao.medo),
                    strokeWidth: 2, // optional
                },
            ];

        return { labels, datasets };
    };

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 2, // optional, default 3
        barPercentage: 0.5,
    };

    const handleFiltrar = () => {
        if (new Date(dataFim) > new Date() || new Date(dataInicio) > new Date(dataFim)) {
            Alert.alert('Erro', 'As datas fornecidas são inválidas.');
        } else {
            fetchHistoricoPositivo();
            fetchHistoricoNegativo();
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gráfico de Histórico de Avaliações</Text>

            {/* Filtros de Data */}
            <View style={styles.dateFilter}>
                <Text>Data Início:</Text>
                <TextInput
                    style={styles.input}
                    value={dataInicio}
                    onChangeText={setDataInicio}
                    placeholder="YYYY-MM-DD"
                />
                <Text>Data Fim:</Text>
                <TextInput
                    style={styles.input}
                    value={dataFim}
                    onChangeText={setDataFim}
                    placeholder="YYYY-MM-DD"
                />
                <Button title="Filtrar" onPress={handleFiltrar} />
            </View>

            {/* Seleção de Gráfico */}
            <View style={styles.chartToggle}>
                <Button title="Gráfico Positivo" onPress={() => setSelectedChart('positivo')} />
                <Button title="Gráfico Negativo" onPress={() => setSelectedChart('negativo')} />
            </View>

            <LineChart
                data={prepareChartData()}
                width={Dimensions.get('window').width - 40} // from react-native
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    dateFilter: {
        marginBottom: 20,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 10,
    },
    chartToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
});
