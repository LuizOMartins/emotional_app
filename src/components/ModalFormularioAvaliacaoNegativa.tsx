import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface ModalFormularioAvaliacaoNegativaProps {
    visible: boolean;
    handleClose: () => void;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    initialValues?: any;
}

export default function ModalFormularioAvaliacaoNegativa({
    visible,
    handleClose,
    onClose,
    onSubmit,
    initialValues,
}: ModalFormularioAvaliacaoNegativaProps) {
    const [formData, setFormData] = useState({
        medo: 0,
        culpa: 0,
        raiva: 0,
        cobrancasInternas: 0,
        cobrancasExternas: 0,
        inseguranca: 0,
        impaciencia: 0,
        perfeccionismo: 0,
        preocupacoes: 0,
        ansiedade: 0,
        baixaAutoestima: 0,
        comparacaoComOutrasPessoas: 0,
    });

    // Preencher o formulário com os valores de edição
    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues);
        }
    }, [initialValues]);

    const handleChange = useCallback((name: keyof typeof formData, value: number) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    }, [formData]);

    const handleSubmit = () => {
        const dataAvaliacao = new Date().toISOString().split('T')[0]; // Preencher com a data atual
        onSubmit({ ...formData, dataAvaliacao });
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.title}>
                        {initialValues ? 'Editar Avaliação Negativa' : 'Nova Avaliação Negativa'}
                    </Text>

                    <View style={styles.sliderContainer}>
                        <Text>Medo: {formData.medo}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={formData.medo}
                            onValueChange={(value) => handleChange('medo', value)}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text>Culpa: {formData.culpa}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={formData.culpa}
                            onValueChange={(value) => handleChange('culpa', value)}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text>Raiva: {formData.raiva}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={formData.raiva}
                            onValueChange={(value) => handleChange('raiva', value)}
                        />
                    </View>

                    {/* Repita para os outros campos, seguindo o padrão acima */}

                    <View style={styles.actions}>
                        <Button title="Cancelar" onPress={onClose} />
                        <Button title={initialValues ? 'Atualizar Avaliação' : 'Enviar Avaliação'} onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    sliderContainer: {
        marginBottom: 20,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
