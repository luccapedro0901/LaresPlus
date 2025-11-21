import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import api from '../axios/api';

export default function AreasScreen() {
  const [abaSelecionada, setAbaSelecionada] = useState<'areas' | 'reservas'>('areas');
  const [reservas, setReservas] = useState<any[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);

  const router = useRouter();

  const areas = [
    { id: 1, nome: 'Piscina', imagem: require('../assets/piscina.jpg') },
    { id: 2, nome: 'Quadra Poliesportiva', imagem: require('../assets/quadra.jpg') },
    { id: 3, nome: 'Churrasqueira', imagem: require('../assets/churrasqueira.jpg') },
  ];

  const carregarReservas = useCallback(async () => {
    try {
      setLoadingReservas(true);
      const idMoradorString = await AsyncStorage.getItem('id_morador');
      if (!idMoradorString) {
        setReservas([]);
        return;
      }

      const idMorador = Number(idMoradorString);
      const { data } = await api.get(`/agendamento/morador/${idMorador}`);
      setReservas(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.log('Erro ao carregar reservas:', error?.response?.data || error);
      Alert.alert('Erro', 'Não foi possível carregar as reservas.');
    } finally {
      setLoadingReservas(false);
    }
  }, []);

  useEffect(() => {
    carregarReservas();
  }, [carregarReservas]);

  useEffect(() => {
    if (abaSelecionada === 'reservas') carregarReservas();
  }, [abaSelecionada, carregarReservas]);

  const navegarParaAgendamento = (id_area: number) => {
    router.push({ pathname: '/AgendamentoAreaScreen', params: { id_area } });
  };

  const imagemArea = (id_area: number) => {
    return areas.find(a => a.id === id_area)?.imagem || null;
  };

  const excluirReserva = async (id_agendamentoRaw: any) => {
    const id = Number(id_agendamentoRaw);
    if (isNaN(id)) {
      console.error('ID inválido para exclusão:', id_agendamentoRaw);
      return Alert.alert('Erro', 'ID do agendamento inválido.');
    }

    let confirmar = true;

    if (typeof window !== 'undefined') {
      confirmar = window.confirm('Deseja realmente cancelar esta reserva?');
    } else {
      confirmar = await new Promise(resolve => {
        Alert.alert(
          'Confirmar exclusão',
          'Deseja realmente cancelar esta reserva?',
          [
            { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
            { text: 'Excluir', style: 'destructive', onPress: () => resolve(true) },
          ]
        );
      });
    }

    if (!confirmar) return;

    try {
      console.log('➡️ Tentando excluir agendamento ID:', id);

      setReservas(prev => prev.filter(r => Number(r.id_agendamento) !== id));

      const resp = await api.delete(`/agendamento/${id}`);
      console.log('✔ DELETE feito com sucesso:', resp.data);

      await carregarReservas();

      if (typeof window === 'undefined') {
        Alert.alert('Sucesso', 'Agendamento cancelado!');
      } else {
        window.alert('Agendamento cancelado!');
      }
    } catch (error: any) {
      console.error('❌ Erro ao excluir agendamento:', error?.response?.data || error);
      await carregarReservas();

      if (typeof window === 'undefined') {
        Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
      } else {
        window.alert('Não foi possível excluir o agendamento.');
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/InicioScreen')}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Agendamento de Áreas</Text>

      <View style={styles.abas}>
        <TouchableOpacity
          style={[styles.aba, abaSelecionada === 'areas' && styles.abaSelecionada]}
          onPress={() => setAbaSelecionada('areas')}
        >
          <Text style={styles.textoAba}>Áreas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.aba, abaSelecionada === 'reservas' && styles.abaSelecionada]}
          onPress={() => setAbaSelecionada('reservas')}
        >
          <Text style={styles.textoAba}>Reservas</Text>
        </TouchableOpacity>
      </View>

      {abaSelecionada === 'areas' && (
        <>
          {areas.map(area => (
            <View key={area.id} style={styles.caixaArea}>
              <Image source={area.imagem} style={styles.imagemArea} />
              <Text style={styles.nomeArea}>{area.nome}</Text>
              <TouchableOpacity
                style={styles.botao}
                onPress={() => navegarParaAgendamento(area.id)}
              >
                <Text style={styles.textoBotao}>Agendar 📅</Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {abaSelecionada === 'reservas' && (
        <>
          {loadingReservas ? (
            <Text style={styles.texto}>Carregando reservas...</Text>
          ) : reservas.length === 0 ? (
            <Text style={styles.texto}>Você ainda não possui reservas.</Text>
          ) : (
            reservas.map(reserva => (
              <View key={String(reserva.id_agendamento)} style={styles.reservaBox}>
                <Image
                  source={imagemArea(reserva.area_comum?.id_area)}
                  style={styles.imagemReserva}
                />

                <Text style={styles.reservaTitulo}>
                  {reserva.area_comum?.nome ?? 'Área'}
                </Text>

                <Text>📅 Dia: {reserva.dia}</Text>
                <Text>🕒 Horário: {reserva.horario}</Text>
                <Text>Status: {reserva.status}</Text>

                <View style={styles.row}>
                  <TouchableOpacity
                    style={styles.btnEditar}
                    onPress={() =>
                      router.push({
                        pathname: '/AgendamentoAreaScreen',
                        params: {
                          id_area: reserva.area_comum?.id_area,
                          editar: 'true',
                          id_agendamento: reserva.id_agendamento,
                          dia: reserva.dia,
                          horario: reserva.horario,
                        },
                      })
                    }
                  >
                    <Text style={{ color: 'white' }}>Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.btnExcluir}
                    onPress={() => excluirReserva(reserva.id_agendamento)}
                  >
                    <Text style={{ color: 'white' }}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  voltar: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  abas: { flexDirection: 'row', marginBottom: 20 },
  aba: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
  },
  abaSelecionada: { borderBottomColor: '#1E6FF2' },
  textoAba: { fontWeight: 'bold' },

  caixaArea: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  imagemArea: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    objectFit: 'cover',
  },
  nomeArea: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  botao: {
    backgroundColor: '#1E6FF2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  textoBotao: { color: 'white', fontWeight: 'bold' },

  reservaBox: {
    backgroundColor: '#ececec',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  imagemReserva: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
    objectFit: 'cover',
  },
  reservaTitulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },

  row: { flexDirection: 'row', marginTop: 10, gap: 10 },

  btnEditar: {
    flex: 1,
    backgroundColor: '#1E6FF2',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnExcluir: {
    flex: 1,
    backgroundColor: '#e63939',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },

  texto: { textAlign: 'center', marginTop: 20 },
});
