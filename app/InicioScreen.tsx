import React from 'react';
import { SafeAreaView, ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function InicioScreen() {
  const router = useRouter(); 

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.menu}>☰</Text>
          <Text style={styles.titulo}>Olá, Pedro Lucca!</Text>
          <Text style={styles.subtitulo}>Apartamento 001 - 23 - SUL Rua 2</Text>
        </View>

        <TextInput style={styles.input} placeholder="Buscar" />

        <Text style={styles.titulo2}>Quais os benefícios do nosso aplicativo?</Text>
        <View style={styles.beneficios}>
          <View style={styles.beneficio}>
            <Text style={styles.icone}>📱</Text>
            <Text>Comodidade</Text>
          </View>
          <View style={styles.beneficio}>
            <Text style={styles.icone}>♻️</Text>
            <Text>Sustentabilidade</Text>
          </View>
          <View style={styles.beneficio}>
            <Text style={styles.icone}>📋</Text>
            <Text>Registro</Text>
          </View>
        </View>

        <Text style={styles.titulo2}>Nossos serviços</Text>

        <TouchableOpacity style={styles.botao} onPress={() => router.push('/AreasScreen')}>
         <Text style={styles.botaoTitulo}>🗓️ AGENDAMENTO DE ÁREAS</Text>
         <Text style={styles.botaoDescricao}>Reserve fácil, use sem preocupações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botao} onPress={() => router.push('/ChamadosScreen')}>
          <Text style={styles.botaoTitulo}>🛠️ ABERTURA DE CHAMADOS</Text>
          <Text style={styles.botaoDescricao}>Solicite e acompanhe sem burocracia</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { backgroundColor: '#1E6FF2', padding: 50, marginBottom: 10 },
  menu: { fontSize: 20, color: 'white', marginBottom: 80 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  subtitulo: { color: 'white', fontSize: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 20 },
  titulo2: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  beneficios: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  beneficio: { alignItems: 'center' },
  icone: { fontSize: 30, marginBottom: 5 },
  botao: { backgroundColor: '#f2f2f2', padding: 15, borderRadius: 10, marginBottom: 15 },
  botaoTitulo: { fontWeight: 'bold', fontSize: 14 },
  botaoDescricao: { fontSize: 12, color: '#555' },
});
