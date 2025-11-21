import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import api from '../../axios/api';
import { useRouter } from 'expo-router';

export default function MoradoresAdmin() {
  const router = useRouter();
  const [moradores, setMoradores] = useState([]);

  async function carregar() {
    try {
      const response = await api.get("/morador");
      setMoradores(response.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar moradores.");
    }
  }

  async function deletar(id: number) {
    Alert.alert("Confirmar", "Excluir morador?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: async () => {
          await api.delete(`/morador/${id}`);
          carregar();
        },
      },
    ]);
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciar Moradores</Text>

      {moradores.map((m: any) => (
        <View key={m.id_morador} style={styles.card}>
          <Text style={styles.text}>ID: {m.id_morador}</Text>
          <Text style={styles.text}>Nome: {m.nome}</Text>
          <Text style={styles.text}>Email: {m.email}</Text>
          <Text style={styles.text}>Tipo: {m.tipo_usuario}</Text>

          <View style={styles.row}>
            <TouchableOpacity style={styles.btnEdit}>
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnDelete} onPress={() => deletar(m.id_morador)}>
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.btnBack} onPress={() => router.push("/AdminDashboard")}>
        <Text style={styles.btnText}>Voltar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15
  },
  text: { fontSize: 16, marginBottom: 3 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  btnEdit: { backgroundColor: "orange", padding: 10, borderRadius: 8, width: "48%" },
  btnDelete: { backgroundColor: "red", padding: 10, borderRadius: 8, width: "48%" },
  btnBack: { backgroundColor: "#0366ff", padding: 15, borderRadius: 10, marginTop: 20 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" }
});
