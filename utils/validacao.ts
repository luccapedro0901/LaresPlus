export function validarEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarSenha(senha: string) {
  // Aceita senhas com mínimo de 4 caracteres
  return senha.trim().length >= 4;
}


export function sanitizarTexto(texto: string) {
  // Remove possíveis caracteres maliciosos
  return texto.replace(/[<>{}]/g, "");
}
