import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../axios/api";

export default function EditarAgendamento() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [idArea, setIdArea] = useState("");
  const [idMorador, setIdMorador] = useState("");

  async function carregar() {
    const resp = await api.get(`/agendamento/${id}`);
    const ag = resp.data;

    setData(ag.data_agendamento);
    setHora(ag.hora_agendamento);
    setIdArea(String(ag.id_area));
    setIdMorador(String(ag.id_morador));
  }

  async function salvar() {
    try {
      await api.put(`/agendamento/${id}`, {
        data_agendamento: data,
        hora_agendamento: hora,
        id_area: Number(idArea),
        id_morador: Number(idMorador),
      });

      Alert.alert("Sucesso", "Agendamento atualizado!");
      router.push("/admin/AgendamentosAdmin");
    } catch {
      Alert.alert("Erro", "Falha ao atualizar agendamento.");
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Agendamento</Text>

      <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="Data" />
      <TextInput style={styles.input} value={hora} onChangeText={setHora} placeholder="Hora" />
      <TextInput style={styles.input} value={idArea} onChangeText={setIdArea} placeholder="ID Área" />
      <TextInput style={styles.input} value={idMorador} onChangeText={setIdMorador} placeholder="ID Morador" />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar Alterações</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.btn, { backgroundColor: "gray" }]} onPress={() => router.back()}>
        <Text style={styles.btnText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, marginVertical: 8 },
  btn: { backgroundColor: "blue", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
