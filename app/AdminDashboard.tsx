import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const verificarAdm = async () => {
      const tipo = await AsyncStorage.getItem('tipo_usuario');

      if (tipo !== 'ADM') {
        Alert.alert("Acesso negado", "Você não tem permissão!");
        router.push('/InicioScreen');
      }
    };

    verificarAdm();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Painel do Administrador</Text>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/admin/ChamadosAdmin')}
      >
        <Text style={styles.botaoTexto}>Gerenciar Chamados</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.botao}
        onPress={() => router.push('/admin/AgendamentosAdmin')}
      >
        <Text style={styles.botaoTexto}>Gerenciar Agendamentos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botao, { backgroundColor: '#f44336' }]}
        onPress={async () => {
          await AsyncStorage.clear();
          router.push('/');
        }}
      >
        <Text style={styles.botaoTexto}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  titulo: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  botao: {
    backgroundColor: '#1E6FF2',
    padding: 16,
    borderRadius: 6,
    marginBottom: 15,
  },
  botaoTexto: { color: 'white', textAlign: 'center', fontSize: 18, fontWeight: 'bold' },
});
