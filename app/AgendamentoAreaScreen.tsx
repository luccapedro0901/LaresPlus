import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../axios/api';

function showAlert(titulo: string, mensagem: string) {
  if (Platform.OS === 'web') {
    window.alert(`${titulo}\n\n${mensagem}`);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

export default function AgendamentoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams() as {
    id_area: string;
    editar?: string;
    id_agendamento?: string;
    dia?: string;
    horario?: string;
  };

  const idArea = Number(params.id_area);

  const [dia, setDia] = useState('');
  const [horario, setHorario] = useState('');
  const [showDate, setShowDate] = useState(false);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    if (params.editar === "true") {
      setDia(params.dia || "");
      setHorario(params.horario || "");
    }
  }, []);

  useEffect(() => {
    if (dia) gerarHorariosValidos();
  }, [dia]);

  const gerarHorariosValidos = () => {
    const lista: string[] = [];

    for (let h = 8; h <= 22; h++) {
      const horaStr = h.toString().padStart(2, "0") + ":00";
      lista.push(horaStr);
    }

    const hoje = new Date().toISOString().split("T")[0];

    if (dia === hoje) {
      const agora = new Date();
      const horaAtual = agora.getHours();

      const filtrados = lista.filter((h) => Number(h.split(":")[0]) > horaAtual);

      setHorariosDisponiveis(filtrados);
    } else {
      setHorariosDisponiveis(lista);
    }
  };

  const realizarAgendamento = async () => {
    try {
      if (!dia || !horario) {
        return showAlert('Erro', 'Preencha a data e o horário.');
      }

      const idMoradorString = await AsyncStorage.getItem('id_morador');
      const idMorador = idMoradorString ? Number(idMoradorString) : null;

      if (!idMorador) {
        return showAlert('Erro', 'Morador não identificado.');
      }

      const dados = {
        dia,
        horario,
        dia_solicitado: new Date().toISOString(),
        status: 'SOLICITADO',
        area_comum: { id_area: idArea },
        morador: { id_morador: idMorador },
      };

      let response;

      if (params.editar === "true" && params.id_agendamento) {
        response = await api.put(`/agendamento/${params.id_agendamento}`, dados);
        if (response.status === 200) {
          showAlert('Sucesso', 'Agendamento atualizado!');
          setTimeout(() => router.push('/AreasScreen'), 300);
          return;
        }
      }

      response = await api.post('/agendamento', dados);

      if (response.status >= 200 && response.status < 300) {
        showAlert('Sucesso', 'Agendamento realizado!');
        setTimeout(() => router.push('/AreasScreen'), 300);
        return;
      }

      showAlert('Erro', 'Não foi possível realizar o agendamento.');

    } catch (error: any) {
      console.error("ERRO:", error);

      if (axios.isAxiosError(error) && error.response) {
        return showAlert('Erro', error.response.data);
      }

      showAlert('Erro', 'Erro inesperado.');
    }
  };

  const hoje = new Date().toISOString().split("T")[0];

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => router.push('/AreasScreen')}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.titulo}>
          {params.editar === "true" ? "Editar Agendamento" : "Novo Agendamento"}
        </Text>

        <Text style={styles.label}>📅 Data</Text>

        {Platform.OS === "web" ? (
          <input
            type="date"
            value={dia}
            min={hoje}
            onChange={(e) => setDia(e.target.value)}
            style={styles.webInput}
          />
        ) : (
          <>
            <TouchableOpacity style={styles.inputButton} onPress={() => setShowDate(true)}>
              <Text style={styles.inputButtonText}>
                {dia ? dia : "Selecionar data"}
              </Text>
            </TouchableOpacity>

            {showDate && (
              <DateTimePicker
                mode="date"
                minimumDate={new Date()}
                value={dia ? new Date(dia) : new Date()}
                onChange={(event, selected) => {
                  setShowDate(false);
                  if (selected) {
                    const format = selected.toISOString().split("T")[0];
                    setDia(format);
                  }
                }}
              />
            )}
          </>
        )}

        <Text style={styles.label}>🕒 Horário</Text>

        <View style={styles.pickerBox}>
          <Picker
            selectedValue={horario}
            onValueChange={(item) => setHorario(item)}
          >
            <Picker.Item label="Selecione um horário" value="" />
            {horariosDisponiveis.map((h) => (
              <Picker.Item key={h} label={h} value={h} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.botao} onPress={realizarAgendamento}>
          <Text style={styles.botaoTexto}>
            {params.editar === "true" ? "SALVAR ALTERAÇÕES" : "CONFIRMAR AGENDAMENTO"}
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { backgroundColor: '#fff' },
  container: { padding: 20 },
  voltar: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  titulo: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 10, marginBottom: 5 },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
  },

  inputButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  inputButtonText: { fontSize: 16 },

  webInput: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },

  botao: {
    backgroundColor: '#1E6FF2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20
  },
  botaoTexto: { color: 'white', fontWeight: 'bold' }
});
