import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InicioScreen() {

  const router = useRouter();
  const [usuario, setUsuario] = useState("Visitante");

  useEffect(() => {
    async function carregarNome() {
      try {
        const id = await AsyncStorage.getItem("id_morador");
        if (!id) return;

        const resposta = await axios.get(`http://10.100.9.41:8081/morador/${id}`);

        if (resposta.data && resposta.data.nome) {
          setUsuario(resposta.data.nome);

          await AsyncStorage.setItem("nome_morador", resposta.data.nome);
        }

      } catch (err) {
        console.log("Erro ao buscar nome do morador:", err);
      }
    }

    carregarNome();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <Text style={styles.menu}>☰</Text>

          <View style={styles.headerText}>
            <Text style={styles.titulo}>Olá, {usuario}!</Text>
          </View>

          <Text style={styles.beneficioTitulo}>Quais os beneficios do nosso aplicativo? </Text>

          <View style={styles.beneficios}>
            <View style={styles.beneficio}>
              <Text style={styles.icone}>📱</Text>
              <Text style={styles.beneficioTexto}>Comodidade</Text>
            </View>
            <View style={styles.beneficio}>
              <Text style={styles.icone}>♻️</Text>
              <Text style={styles.beneficioTexto}>Sustentabilidade</Text>
            </View>
            <View style={styles.beneficio}>
              <Text style={styles.icone}>📋</Text>
              <Text style={styles.beneficioTexto}>Registro</Text>
            </View>
          </View>
        </View>

        <Text style={styles.tituloServicos}>Nossos serviços</Text>

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
  container: { paddingBottom: 30 },
  header: { 
    backgroundColor: '#1E6FF2',
    paddingVertical: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  menu: { fontSize: 26, color: 'white', marginBottom: 20 },
  headerText: { marginBottom: 25 },
  titulo: { color: 'white', fontWeight: 'bold', fontSize: 20 },
  beneficioTitulo: { color: 'white', fontWeight: 'bold', fontSize: 18, paddingBottom: 5 },
  beneficios: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  beneficio: { alignItems: 'center', width: "33%" },
  icone: { fontSize: 40, color: 'white' },
  beneficioTexto: { color: 'white', marginTop: 5 },
  tituloServicos: { fontSize: 20, fontWeight: 'bold', marginTop: 25, marginLeft: 20 },
  botao: { 
  backgroundColor: '#fff', 
  padding: 18, 
  borderRadius: 15, 
  marginHorizontal: 20,
  marginTop: 15,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  elevation: 5,
},

  botaoTitulo: { fontWeight: 'bold', fontSize: 15 },
  botaoDescricao: { fontSize: 12, color: '#555' },
});