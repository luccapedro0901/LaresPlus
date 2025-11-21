import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import api from '../../axios/api';

export default function ChamadosAdmin() {
  const router = useRouter();
  const [chamados, setChamados] = useState([]);

  async function carregarChamados() {
    try {
      const response = await api.get("/chamado_servico");
      setChamados(response.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Erro", "Não foi possível carregar os chamados.");
    }
  }

  async function deletarChamado(id: number) {
    Alert.alert("Confirmar", "Deseja realmente excluir este chamado?", [
      { text: "Cancelar" },
      {
        text: "Excluir",
        onPress: async () => {
          await api.delete(`/chamado_servico/${id}`);
          carregarChamados();
        },
      },
    ]);
  }

  useEffect(() => {
    carregarChamados();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gerenciar Chamados</Text>

      {chamados.map((c: any) => (
        <TouchableOpacity
          key={c.id_chamado}
          style={styles.card}
          onPress={() => router.push(`/admin/DetalhesChamado?id=${c.id_chamado}`)}
        >
          <Text style={styles.text}>ID: {c.id_chamado}</Text>
          <Text style={styles.text}>Serviço: {c.chamado_servico}</Text>
          <Text style={styles.text}>Descrição: {c.descricao_chamado}</Text>
          <Text style={styles.text}>Status: {c.status_chamado}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={styles.btnEdit}
              onPress={() => router.push(`/admin/EditarChamado?id=${c.id_chamado}`)}
            >
              <Text style={styles.btnText}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnStatus}
              onPress={() => router.push(`/admin/StatusChamado?id=${c.id_chamado}`)}
            >
              <Text style={styles.btnText}>Status</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnDelete}
              onPress={() => deletarChamado(c.id_chamado)}
            >
              <Text style={styles.btnText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  btnEdit: { backgroundColor: "orange", padding: 10, borderRadius: 8, width: "30%" },
  btnStatus: { backgroundColor: "green", padding: 10, borderRadius: 8, width: "30%" },
  btnDelete: { backgroundColor: "red", padding: 10, borderRadius: 8, width: "30%" },
  btnBack: { backgroundColor: "#0366ff", padding: 15, borderRadius: 10, marginTop: 20 },
  btnText: { color: "#fff", fontWeight: "bold", textAlign: "center" }
});
