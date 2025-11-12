import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../axios/api';

export default function AgendamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idArea = params.id_area ? Number(params.id_area) : null;

  const [dia, setDia] = useState('');
  const [horario, setHorario] = useState('');

  const realizarAgendamento = async () => {
    try {
      if (!dia || !horario) {
        Alert.alert('Erro', 'Preencha a data e o horário.');
        return;
      }

      const idMoradorString = await AsyncStorage.getItem('id_morador');
      const idMorador = idMoradorString ? Number(idMoradorString) : null;

      if (!idMorador) {
        Alert.alert('Erro', 'Morador não identificado.');
        return;
      }

      const dados = {
        dia, // formato: YYYY-MM-DD
        horario, // formato: HH:mm
        dia_solicitado: new Date().toISOString(),
        status: 'SOLICITADO',
        area_comum: { id_area: idArea },
        morador: { id_morador: idMorador },
      };

      const response = await api.post('/agendamento', dados);

      if (response.status === 201 || response.status === 200) {
        Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
        router.push('/AreasScreen');
      } else {
        Alert.alert('Erro', 'Não foi possível realizar o agendamento.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Falha ao conectar ao servidor.');
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/AreasScreen')}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.textoTitulo}>Solicitação de Agendamento</Text>

        <Text style={styles.label}>📅 Data (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2025-11-20"
          value={dia}
          onChangeText={setDia}
        />

        <Text style={styles.label}>🕒 Horário (HH:MM)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 14:30"
          value={horario}
          onChangeText={setHorario}
        />

        <TouchableOpacity style={styles.botao} onPress={realizarAgendamento}>
          <Text style={styles.botaoTexto}>CONFIRMAR AGENDAMENTO</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'white' },
  container: { padding: 20 },
  voltar: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  textoTitulo: { textAlign: 'center', fontWeight: 'bold', fontSize: 25, marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  botao: {
    backgroundColor: '#1E6FF2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
