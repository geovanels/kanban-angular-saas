export function formatDate(timestamp: any): string {
  if (!timestamp) return 'Data não disponível';
  try {
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleDateString('pt-BR');
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString('pt-BR');
    if (timestamp instanceof Date) return timestamp.toLocaleDateString('pt-BR');
    return new Date(timestamp).toLocaleDateString('pt-BR');
  } catch {
    return 'Data inválida';
  }
}

export function formatDateTime(timestamp: any): string {
  if (!timestamp) return '—';
  try {
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR');
    if (timestamp.toDate) return timestamp.toDate().toLocaleString('pt-BR');
    if (timestamp instanceof Date) return timestamp.toLocaleString('pt-BR');
    return new Date(timestamp).toLocaleString('pt-BR');
  } catch {
    return '—';
  }
}

export function extractNameFromEmail(email: string): string {
  const localPart = email.split('@')[0];
  return localPart
    .replace(/[._]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Formata uma entrada de texto/número como moeda BRL (R$ 1.234,56).
 *
 * Convenção: valores numéricos são interpretados como **centavos** (ex.: 1955811 → R$ 19.558,11).
 * Isso unifica o tratamento entre valores legados (digitados como número inteiro) e
 * valores novos persistidos pelo input de currency (sempre centavos).
 *
 * Se vier um decimal por engano (ex.: 19558.11), converte multiplicando por 100.
 */
export function formatCurrencyBRL(value: any): string {
  if (value === null || value === undefined || value === '') return '';
  let digits: string;
  if (typeof value === 'number') {
    const cents = Number.isInteger(value) ? value : Math.round(value * 100);
    digits = Math.abs(cents).toString();
  } else {
    digits = String(value).replace(/\D/g, '');
  }
  if (!digits) return '';
  digits = digits.replace(/^0+(?=\d)/, '');
  const cents = digits.slice(-2).padStart(2, '0');
  const intPart = digits.slice(0, -2) || '0';
  const intFormatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `R$ ${intFormatted},${cents}`;
}

/**
 * Converte uma string monetária no formato BRL ("R$ 1.234,56") em centavos (number inteiro).
 * "R$ 19.558,11" → 1955811
 * Aceita também números (já em centavos) e decimais (converte para centavos).
 */
export function parseCurrencyToNumber(value: any): number | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : Math.round(value * 100);
  }
  const digits = String(value).replace(/\D/g, '');
  if (!digits) return null;
  return parseInt(digits, 10);
}
