// Portão do Tempo: valida um dos identificadores do livro, sem criar credenciais.
// Normalizar na digitação nunca altera o significado do código de três dígitos.
export function normalizeProgramCode(value) {
  return String(value ?? '').replace(/\D/g, '').slice(0, 3);
}

export function resolveProgramCode(programs, value) {
  const code = String(value ?? '').trim();
  if (!/^\d{3}$/.test(code)) {
    return { program: null, error: 'Digite um código de três números para abrir o portal.' };
  }
  const program = programs.find(item => item.code === code) ?? null;
  if (!program) {
    return { program: null, error: 'Código não encontrado neste livro. Confira e tente novamente.' };
  }
  return { program, error: null };
}
