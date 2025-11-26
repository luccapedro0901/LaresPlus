import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import api from '../axios/api';
import ModalPicker from '../components/ModalPicker';
import { recuperarIdMorador } from '../utils/secureStorage';

export default function AberturadeChamadosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idAreaSelecionada = params.id_area ?? '';

  const [area_comum, setArea_comum] = useState(idAreaSelecionada);
  const [motivo, setMotivo] = useState('');
  const [descricao_chamado, setDescricao_chamado] = useState('');
  const [situacao, setSituacao] = useState('');

  const areas = [
    { label: "Piscina", value: "1" },
    { label: "Quadra Poliesportiva", value: "2" },
    { label: "Churrasqueira", value: "3" },
    { label: "Salão de Festas", value: "4" },
  ];

  const motivos = [
    { label: "Manutenção", value: "MANUTENCAO" },
    { label: "Limpeza", value: "LIMPEZA" },
    { label: "Segurança", value: "SEGURANCA" },
    { label: "Infraestrutura", value: "INFRAESTRUTURA" },
    { label: "Outros", value: "OUTROS" },
  ];

  const situacoes = [
    { label: "Urgente", value: "URGENTE" },
    { label: "Moderado", value: "MODERADO" },
    { label: "Leve", value: "LEVE" },
  ];

  // Função para sanitizar strings
  const sanitizeString = (input: string): string => {
    return input
      .trim()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;");
  };

  const chamadoServico = async () => {
    try {
      const idMorador = await recuperarIdMorador();
      if (!idMorador) {
        Alert.alert("Erro", "Morador não identificado.");
        return;
      }

      // Sanitização
      const descricaoSanitizada = sanitizeString(descricao_chamado);
      const motivoSanitizado = sanitizeString(motivo);
      const situacaoSanitizada = sanitizeString(situacao);
      const areaId = Number(area_comum);

      // Validações básicas
      if (!descricaoSanitizada || !motivoSanitizado || !situacaoSanitizada || isNaN(areaId)) {
        Alert.alert("Erro", "Todos os campos devem ser preenchidos corretamente.");
        return;
      }

      const response = await api.post('/chamado_servico', {
        descricao_chamado: descricaoSanitizada,
        area_comum: { id_area: areaId },
        motivo: motivoSanitizado,
        situacao: situacaoSanitizada,
        morador: { id_morador: Number(idMorador) },
      });

      Alert.alert("Chamado realizado!", response.data.mensagem);
      router.push('/ChamadosScreen');

    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível enviar o chamado.");
    }
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.push('/ChamadosScreen')}>
          <Text style={styles.voltar}>← Voltar</Text>
        </TouchableOpacity>

        <Text style={styles.textoTitulo}>Abertura do chamado</Text>
        <Text style={styles.textoTopo}>
          Por favor, preencha o formulário e sua solicitação será recebida!
        </Text>

        <ModalPicker label="Área Comum" selectedValue={area_comum} options={areas} onSelect={setArea_comum} />
        <ModalPicker label="Motivo" selectedValue={motivo} options={motivos} onSelect={setMotivo} />

        <TextInput 
          style={[styles.input, styles.textArea]}
          placeholder="Descrição do chamado"
          value={descricao_chamado}
          onChangeText={setDescricao_chamado}
          multiline
        />

        <ModalPicker label="Situação" selectedValue={situacao} options={situacoes} onSelect={setSituacao} />

        <TouchableOpacity style={styles.botao} onPress={chamadoServico}>
          <Text style={styles.botaoTexto}>ENVIAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'white' },
  container: { padding: 20},
  voltar: { fontSize: 18, marginBottom: 10, fontWeight: 'bold' },
  textoTitulo: { textAlign: 'center', fontWeight: 'bold', fontSize: 25 },
  textoTopo: { textAlign: 'center', marginVertical: 15, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
  textArea: { height: 100, textAlignVertical: 'top' },
  botao: { backgroundColor: '#1E6FF2', padding: 12, borderRadius: 6, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
