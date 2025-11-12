import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../axios/api';
import axios from 'axios';

export default function CadastroScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [lembrar, setLembrar] = useState(false);

  const validarMorador = async () => {
    try {
      const response = await api.get('/validar_morador', {
        params: { email, senha },
      });

      console.log('Resposta login:', response.data);

      const { id_morador, nome } = response.data;

      if (!id_morador) {
        Alert.alert('Erro', 'Credenciais inválidas!');
        return;
      }

      await AsyncStorage.setItem('id_morador', id_morador.toString());

      Alert.alert('Bem-vindo', `Olá ${nome}!`);

      router.push('/InicioScreen');
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 401) {
          Alert.alert('Erro', 'Credenciais inválidas!');
        } else {
          Alert.alert('Erro', 'Tente novamente mais tarde!');
        }
      } else {
        Alert.alert('Erro', 'Não foi possível conectar ao servidor!');
      }
      console.error('Erro login:', error);
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
      <Image
        source={require('../assets/logo.png')}
        style={styles.imagem}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 70, padding: 20, flex: 1 },
  titulo: { fontSize: 30, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#999', marginBottom: 15, padding: 10, borderRadius: 5 },
  link: { marginTop: 10, fontSize: 15, color: '#1E6FF2', textAlign: 'center' , fontWeight: 'bold'},
  imagem: { width: 300, height: 300, marginTop: 20, alignSelf: 'center' },
  login:{marginBottom: 5, fontWeight:'bold', marginTop:5},
  botao: { backgroundColor: '#1E6FF2', padding: 12, borderRadius: 6, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
