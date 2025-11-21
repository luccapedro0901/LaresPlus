import React from 'react';
import { ScrollView, View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChamadosScreen() {
  const router = useRouter();

  const chamados = [
    { titulo: 'Hidráulica', data: '28/02/25' },
    { titulo: 'Piscina', data: '01/02/25' },
    { titulo: 'Elétrica', data: '01/01/25' },
  ];

  return (
    <ScrollView style={styles.container}>
      
      {/* Botão de Voltar */}
      <TouchableOpacity onPress={() => router.push('/InicioScreen')}>
        <Text style={styles.voltar}>← Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Chamados de serviços</Text>

      {chamados.map((chamado, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.nome}>{chamado.titulo}</Text>
          <Text style={styles.data}>Solicitado: {chamado.data}</Text>
          <Text style={styles.icone}>🛠️</Text>
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
    backgroundColor: '#f2f2f2', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15 
  },
  nome: { fontSize: 16, fontWeight: 'bold' },
  data: { fontSize: 12, color: '#555', marginBottom: 5 },
  icone: { fontSize: 20 },
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
});
