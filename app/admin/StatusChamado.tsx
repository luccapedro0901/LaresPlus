import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../axios/api";

export default function StatusChamado() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [statusSelecionado, setStatusSelecionado] = useState("");

  const statusList = ["PENDENTE", "EM_ANDAMENTO", "CONCLUIDO"];

  async function carregar() {
    const resp = await api.get(`/chamado/${id}`);
    setStatusSelecionado(resp.data.status_chamado);
  }

  async function salvar() {
    try {
      await api.put(`/chamado/status/${id}`, { status_chamado: statusSelecionado });
      Alert.alert("Sucesso", "Status atualizado!");
      router.back();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar o status.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alterar Status</Text>

      {statusList.map((st) => (
        <TouchableOpacity
          key={st}
          style={[styles.statusItem, statusSelecionado === st ? styles.selected : null]}
          onPress={() => setStatusSelecionado(st)}
        >
          <Text style={styles.statusText}>{st}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar Status</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },

  statusItem: {
    padding: 14,
    backgroundColor: "#e5e5e5",
    marginBottom: 12,
    borderRadius: 10,
  },

  selected: {
    backgroundColor: "#2ecc71",
  },

  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#2980b9",
    padding: 15,
    marginTop: 30,
    borderRadius: 10,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
