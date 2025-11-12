import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/api';

export default function CadastrarUserScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');

  const cadastroMorador = async () => {
    try {
      const response = await api.post('/cadastro_morador', {
        nome,
        email,
        senha,
      });

      console.log('Resposta do cadastro:', response.data);

      const { id_morador, mensagem } = response.data;

      if (!id_morador) {
        Alert.alert('Erro', 'Não foi possível cadastrar o usuário.');
        return;
      }

      await AsyncStorage.setItem('id_morador', id_morador.toString());

      Alert.alert('Sucesso', mensagem);

      router.push('/InicioScreen');
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 409) {
          Alert.alert('Erro', 'Este e-mail já está cadastrado!');
        } else {
          Alert.alert('Erro', error.response.data.mensagem || 'Tente novamente mais tarde!');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor!');
      }
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastre-se</Text>

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
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      
      <TouchableOpacity style={styles.botao} onPress={cadastroMorador}>
      <Text style={styles.botaoTexto}>CADASTRAR</Text>
      </TouchableOpacity>


      <TouchableOpacity onPress={() => router.push('/CadastroScreen')}>
        <Text style={styles.link}>Já possui uma conta? Faça login</Text>
      </TouchableOpacity>

      <Image
        source={require('../assets/logo.png')}
        style={styles.imagem}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 60, flex: 1 },
  titulo: { fontSize: 26, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', borderRadius: 5, padding: 10, marginBottom: 15 },
  link: { textAlign: 'center', fontWeight: 'bold', color: '#1E6FF2', marginTop: 10 , fontSize: 15,},
  imagem: { width: 300, height: 300, alignSelf: 'center', marginTop: 20 },
  botao: { backgroundColor: '#1E6FF2', padding: 12, borderRadius: 6, alignItems: 'center', marginVertical: 10  },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
