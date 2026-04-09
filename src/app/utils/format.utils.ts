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
