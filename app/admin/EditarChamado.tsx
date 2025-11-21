import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../axios/api";

export default function EditarChamado() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [descricao, setDescricao] = useState("");
  const [servico, setServico] = useState("");

  async function carregar() {
    try {
      const resp = await api.get(`/chamado/${id}`);
      setDescricao(resp.data.descricao_chamado);
      setServico(resp.data.chamado_servico);
    } catch (err) {
      Alert.alert("Erro", "Não foi possível carregar o chamado.");
    }
  }

  async function salvar() {
    try {
      await api.put(`/chamado/${id}`, {
        descricao_chamado: descricao,
        chamado_servico: servico,
      });

      Alert.alert("Sucesso", "Chamado atualizado!");
      router.back();
    } catch (err) {
      Alert.alert("Erro", "Não foi possível atualizar.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Serviço</Text>
      <TextInput
        style={styles.input}
        value={servico}
        onChangeText={setServico}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 15 },
  input: { backgroundColor: "#f1f1f1", padding: 12, borderRadius: 10, marginTop: 5 },
  btn: { backgroundColor: "#2e86de", padding: 14, marginTop: 30, borderRadius: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 16, fontWeight: "bold" }
});
