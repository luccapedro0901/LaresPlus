import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import api from "../../axios/api";

export default function CriarAgendamento() {
  const router = useRouter();
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [idArea, setIdArea] = useState("");
  const [idMorador, setIdMorador] = useState("");

  async function salvar() {
    try {
      await api.post("/agendamento", {
        data_agendamento: data,
        hora_agendamento: hora,
        id_area: Number(idArea),
        id_morador: Number(idMorador),
      });

      Alert.alert("Sucesso", "Agendamento criado!");
      router.push("/admin/AgendamentosAdmin");
    } catch {
      Alert.alert("Erro", "Falha ao salvar agendamento.");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput style={styles.input} placeholder="Data (AAAA-MM-DD)" value={data} onChangeText={setData} />
      <TextInput style={styles.input} placeholder="Hora (HH:MM)" value={hora} onChangeText={setHora} />
      <TextInput style={styles.input} placeholder="ID Área" value={idArea} onChangeText={setIdArea} />
      <TextInput style={styles.input} placeholder="ID Morador" value={idMorador} onChangeText={setIdMorador} />

      <TouchableOpacity style={styles.btn} onPress={salvar}>
        <Text style={styles.btnText}>Salvar</Text>
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
  btn: { backgroundColor: "green", padding: 15, borderRadius: 10, marginTop: 10 },
  btnText: { color: "white", textAlign: "center", fontWeight: "bold" },
});
