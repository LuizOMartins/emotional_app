import React, { useState, useEffect, useCallback } from 'react';
import { Modal, View, Text, Button, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface ModalFormularioAvaliacaoPositivaProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (formData: any) => void;
    initialValues?: any;
}

export default function ModalFormularioAvaliacaoPositiva({
    visible,
    onClose,
    onSubmit,
    initialValues,
}: ModalFormularioAvaliacaoPositivaProps) {
    const [formData, setFormData] = useState({
        fe: 0,
        paciencia: 0,
        pazEspirito: 0,
        calma: 0,
        tranquilidade: 0,
        autoconfianca: 0,
        autojulgamentoPositivo: 0,
        autovalorizacao: 0,
        forcaDeVontade: 0,
        alegriaDeViver: 0,
        gratidao: 0,
        gentileza: 0,
        perdaoPelosSeusErros: 0,
        perdaoPelosErrosDosOutros: 0,
    });

    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        if (initialValues) {
            setFormData(initialValues); // Preenche o formulário com os valores de edição
        }
    }, [initialValues]);

    const handleChange = useCallback((name: keyof typeof formData, value: number) => {
        setFormData({
            ...formData,
            [name]: value,
        });
    }, [formData]);

    const handleSubmit = () => {
        const dataAvaliacao = new Date().toISOString().split('T')[0]; // Preenche com a data atual
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
                        {initialValues ? 'Editar Avaliação Positiva' : 'Nova Avaliação Positiva'}
                    </Text>

                    <View style={styles.sliderContainer}>
                        <Text>Fé: {formData.fe}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={formData.fe}
                            onValueChange={(value) => handleChange('fe', value)}
                        />
                    </View>

                    <View style={styles.sliderContainer}>
                        <Text>Paciência: {formData.paciencia}</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={10}
                            value={formData.paciencia}
                            onValueChange={(value) => handleChange('paciencia', value)}
                        />
                    </View>

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
