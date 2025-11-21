import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../axios/api';

export default function AgendamentosAdmin() {
  const router = useRouter();
  const [agendamentos, setAgendamentos] = useState([]);

  async function carregar() {
    try {
      const response = await api.get("/agendamento");
      setAgendamentos(response.data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar agendamentos.");
    }
  }

  async function deletar(id: number) {
    Alert.alert("Confirmar", "Excluir agendamento?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: async () => {
          await api.delete(`/agendamento/${id}`);
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
          {/* VOLTAR */}
          <TouchableOpacity onPress={() => router.push('/InicioScreen')}>
            <Text style={styles.voltar}>← Voltar</Text>
          </TouchableOpacity>
      <Text style={styles.title}>Gerenciar Agendamentos</Text>

      {agendamentos.map((a: any) => (
        <View key={a.id_agendamento} style={styles.card}>
          <Text style={styles.text}>ID: {a.id_agendamento}</Text>
          <Text style={styles.text}>Data: {a.data_agendamento}</Text>
          <Text style={styles.text}>Hora: {a.hora_agendamento}</Text>
          <Text style={styles.text}>Área: {a.id_area}</Text>
          <Text style={styles.text}>Morador: {a.id_morador}</Text>

          <View style={styles.row}>
            <TouchableOpacity
  style={styles.btnEdit}
            onPress={() => router.push(`/admin/EditarAgendamento?id=${a.id_agendamento}`)}>
<Text style={styles.btnText}>Editar</Text>
</TouchableOpacity>


            <TouchableOpacity style={styles.btnDelete} onPress={() => deletar(a.id_agendamento)}>
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
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" },
  voltar: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});
