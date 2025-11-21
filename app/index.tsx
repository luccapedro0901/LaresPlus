import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.image} />
      <Text style={styles.title}>Seja bem vindo!</Text>


        <TouchableOpacity style={styles.botao} onPress={() => router.push('/CadastroScreen')}>
                  <Text style={styles.botaoTexto}>ACESSE O APLICATIVO</Text>
                </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  image: { width: '150%', height: undefined, aspectRatio: 1 },
  title: { fontSize: 20, marginBottom: 10 },
  botao: { backgroundColor: '#1E6FF2', padding: 12, borderRadius: 6, alignItems: 'center' },
  botaoTexto: { color: 'white', fontWeight: 'bold' },
});
