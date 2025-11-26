import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

async function setItem(key: string, value: string) {
  if (isWeb) return AsyncStorage.setItem(key, value); 
  return SecureStore.setItemAsync(key, value);
}

async function getItem(key: string) {
  if (isWeb) return AsyncStorage.getItem(key);
  return SecureStore.getItemAsync(key);
}

async function deleteItem(key: string) {
  if (isWeb) return AsyncStorage.removeItem(key);
  return SecureStore.deleteItemAsync(key);
}

export async function salvarIdMorador(id: number) {
  await setItem("id_morador", id.toString());
}

export async function recuperarIdMorador() {
  return await getItem("id_morador");
}

export async function salvarTipoUsuario(tipo: string) {
  await setItem("tipo_usuario", tipo);
}

export async function recuperarTipoUsuario() {
  return await getItem("tipo_usuario");
}

export async function limparSecureStorage() {
  await deleteItem("id_morador");
  await deleteItem("tipo_usuario");
}
