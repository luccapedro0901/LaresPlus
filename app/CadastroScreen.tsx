import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import api from '../axios/api';
import axios from 'axios';
import { salvarIdMorador, salvarTipoUsuario } from '../utils/secureStorage';
import { validarEmail, validarSenha, sanitizarTexto } from '../utils/validacao';

export default function CadastroScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const validarMorador = async () => {
    const emailLimpo = sanitizarTexto(email);
    const senhaLimpa = sanitizarTexto(senha);

    if (!emailLimpo || !senhaLimpa) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    if (!validarEmail(emailLimpo)) {
      Alert.alert("Erro", "Informe um e-mail válido.");
      return;
    }

    if (!validarSenha(senhaLimpa)) {
      Alert.alert("Erro", "A senha deve ter no mínimo 4 caracteres.");
      return;
    }

    try {
      const response = await api.post('/validar_morador', {
        email: emailLimpo,
        senha: senhaLimpa
      });

      if (__DEV__) console.log('Resposta login:', response.data);

      const { id_morador, nome, tipo_usuario } = response.data;

      if (!id_morador) {
        Alert.alert('Erro', 'Credenciais inválidas!');
        return;
      }

      await salvarIdMorador(id_morador);
      await salvarTipoUsuario(tipo_usuario);

      Alert.alert('Bem-vindo', `Olá ${nome}!`);

      if (tipo_usuario === 'ADM') {
        router.push('/AdminDashboard');
      } else {
        router.push('/InicioScreen');
      }

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert('Erro', 'Credenciais inválidas!');
        } else {
          Alert.alert('Erro', 'Tente novamente mais tarde!');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor!');
      }
      if (__DEV__) console.error('Erro login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Faça seu login</Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity style={styles.botao} onPress={validarMorador}>
        <Text style={styles.botaoTexto}>ACESSAR</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/CadastrarUserScreen')}>
        <Text style={styles.link}>Não tem uma conta? Faça o cadastro</Text>
      </TouchableOpacity>

      <Image source={require('../assets/logo.png')} style={styles.imagem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 70, padding: 20, flex: 1 },
  titulo: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', marginBottom: 15, padding: 10, borderRadius: 5 },
  link: { marginTop: 10, fontSize: 15, color: '#1E6FF2', textAlign: 'center', fontWeight: 'bold' },
  imagem: { width: 300, height: 300, marginTop: 20, alignSelf: 'center' },
  botao: { backgroundColor: '#1E6FF2', padding: 12, borderRadius: 6, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
