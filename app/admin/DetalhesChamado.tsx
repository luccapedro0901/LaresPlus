import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../axios/api";

export default function DetalhesChamado() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [chamado, setChamado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    try {
      const resp = await api.get(`/chamado/${id}`);
      setChamado(resp.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 30 }} />;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalhes do Chamado</Text>

      <Text style={styles.label}>Serviço</Text>
      <Text style={styles.value}>{chamado.chamado_servico}</Text>

      <Text style={styles.label}>Descrição</Text>
      <Text style={styles.value}>{chamado.descricao_chamado}</Text>

      <Text style={styles.label}>Status</Text>
      <Text style={styles.value}>{chamado.status_chamado}</Text>

      <Text style={styles.label}>Data de Abertura</Text>
      <Text style={styles.value}>{chamado.data_abertura}</Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => router.push(`/admin/EditarChamado?id=${chamado.id_chamado}`)}
      >
        <Text style={styles.btnText}>Editar Chamado</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: "#27ae60" }]}
        onPress={() => router.push(`/admin/StatusChamado?id=${chamado.id_chamado}`)}
      >
        <Text style={styles.btnText}>Alterar Status</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 15 },
  value: { fontSize: 15, backgroundColor: "#f1f1f1", padding: 12, borderRadius: 8, marginTop: 4 },
  btn: { backgroundColor: "#2980b9", padding: 14, borderRadius: 10, marginTop: 25 },
  btnText: { textAlign: "center", color: "#fff", fontSize: 16, fontWeight: "bold" }
});
