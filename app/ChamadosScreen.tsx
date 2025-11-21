import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/api';

interface Chamado {
  id_chamado: number;
  descricao_chamado: string;
  data_solicitacao: string;
  status: string;
  tipo?: string;
}

export default function ChamadosScreen() {
  const router = useRouter();
  const [chamados, setChamados] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarChamados = async () => {
    try {
      setLoading(true);
      const idMoradorString = await AsyncStorage.getItem("id_morador");
      if (!idMoradorString) return;

      const idMorador = Number(idMoradorString);
      const response = await api.get(`/chamado_servico/morador/${idMorador}`);
      setChamados(response.data);
    } catch (error) {
      console.error("Erro ao carregar chamados:", error);
      Alert.alert("Erro", "Não foi possível carregar seus chamados.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      carregarChamados();
    }, [])
  );

  const corStatus = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDENTE": return "#E0A800"; // amarelo
      case "RESOLVIDO": return "#28A745"; // verde
      case "CANCELADO": return "#DC3545"; // vermelho
      default: return "#6C757D"; // cinza
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      <TouchableOpacity onPress={() => router.push('/InicioScreen')}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Meus Chamados</Text>

      {chamados.length === 0 && (
        <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16 }}>
          Você não possui chamados ainda.
        </Text>
      )}

      {chamados.map((chamado) => (
        <View key={chamado.id_chamado} style={styles.card}>
          <Text style={styles.nome}>{chamado.descricao_chamado}</Text>

          {chamado.tipo && (
            <Text style={styles.local}>Local: {chamado.tipo}</Text>
          )}

          <Text style={styles.data}>Solicitado: {chamado.data_solicitacao}</Text>

          <View style={[styles.statusBadge, { backgroundColor: corStatus(chamado.status) }]}>
            <Text style={styles.statusTexto}>{chamado.status}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity 
        style={styles.botaoNovoChamado} 
        onPress={() => router.push('/AberturadeChamadosScreen')}
      >
        <Text style={styles.textoBotao}>NOVO CHAMADO</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  voltar: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  
  card: { 
    backgroundColor: '#F8F9FA', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  nome: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  local: { fontSize: 14, color: '#333', marginBottom: 5, fontStyle: 'italic' },
  data: { fontSize: 13, color: '#555', marginBottom: 8 },

  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },

  statusTexto: { 
    color: "white", 
    fontWeight: "bold",
    fontSize: 12,
  },

  botaoNovoChamado: { 
    backgroundColor: '#1E6FF2', 
    padding: 12, 
    borderRadius: 8, 
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotao: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16 
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
