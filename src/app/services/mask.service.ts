import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MaskService {

  // Aplicar máscara de CPF: 000.000.000-00
  applyCpfMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (cleaned.length <= 11) {
      return cleaned
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return cleaned.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // Aplicar máscara de CNPJ: 00.000.000/0000-00
  applyCnpjMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // Aplica a máscara
    if (cleaned.length <= 14) {
      return cleaned
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
    }
    
    return cleaned.slice(0, 14)
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

  // Aplicar máscara de telefone brasileiro: (00) 00000-0000 ou (00) 0000-0000
  applyPhoneMask(value: string): string {
    if (!value) return '';
    
    // Remove tudo que não é número
    const cleaned = value.replace(/\D/g, '');
    
    // Celular (11 dígitos)
    if (cleaned.length === 11) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{4})$/, '$1-$2');
    }
    
    // Telefone fixo (10 dígitos)
    if (cleaned.length === 10) {
      return cleaned
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d{4})$/, '$1-$2');
    }
    
    // Máscara parcial durante a digitação
    if (cleaned.length <= 11) {
      let masked = cleaned;
      if (cleaned.length >= 2) {
        masked = cleaned.replace(/(\d{2})(\d)/, '($1) $2');
      }
      if (cleaned.length >= 7) {
        masked = masked.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
      }
      return masked;
    }
    
    // Limita a 11 dígitos
    return this.applyPhoneMask(cleaned.slice(0, 11));
  }

  // Validar CPF
  isValidCpf(cpf: string): boolean {
    if (!cpf) return false;
    
    // Remove formatação
    const cleaned = cpf.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos
    if (cleaned.length !== 11) return false;
    
    // Verifica sequências iguais
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Validação dos dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return parseInt(cleaned.charAt(9)) === digit1 && parseInt(cleaned.charAt(10)) === digit2;
  }

  // Validar CNPJ
  isValidCnpj(cnpj: string): boolean {
    if (!cnpj) return false;
    
    // Remove formatação
    const cleaned = cnpj.replace(/\D/g, '');
    
    // Verifica se tem 14 dígitos
    if (cleaned.length !== 14) return false;
    
    // Verifica sequências iguais (todos os dígitos iguais)
    if (/^(\d)\1+$/.test(cleaned)) return false;
    
    // Convertemos para array de números para facilitar os cálculos
    const digits = cleaned.split('').map(Number);
    
    // Validação do primeiro dígito verificador
    let sum1 = 0;
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++) {
      sum1 += digits[i] * weights1[i];
    }
    const remainder1 = sum1 % 11;
    const digit1 = remainder1 < 2 ? 0 : 11 - remainder1;
    
    // Validação do segundo dígito verificador
    let sum2 = 0;
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 13; i++) {
      sum2 += digits[i] * weights2[i];
    }
    const remainder2 = sum2 % 11;
    const digit2 = remainder2 < 2 ? 0 : 11 - remainder2;
    
    // Verifica se os dígitos calculados coincidem com os fornecidos
    return digits[12] === digit1 && digits[13] === digit2;
  }

  // Validar email
  isValidEmail(email: string): boolean {
    if (!email) return false;
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  // Remover formatação (manter só números)
  removeFormatting(value: string): string {
    if (!value) return '';
    return value.replace(/\D/g, '');
  }

  // Obter cores da temperatura
  getTemperatureColor(temperature: string): string {
    switch (temperature?.toLowerCase()) {
      case 'quente': return '#EF4444'; // red-500
      case 'morno': return '#EAB308'; // yellow-500  
      case 'frio': return '#3B82F6'; // blue-500
      default: return '#6B7280'; // gray-500
    }
  }

  // Obter classe CSS da temperatura
  getTemperatureClass(temperature: string): string {
    switch (temperature?.toLowerCase()) {
      case 'quente': return 'bg-red-500 text-white';
      case 'morno': return 'bg-yellow-500 text-white';
      case 'frio': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  }

  // Métodos de máscara para eventos de input
  maskPhone(event: any): void {
    const input = event.target;
    const value = input.value;
    const maskedValue = this.applyPhoneMask(value);
    input.value = maskedValue;
    // Disparar evento de input para atualizar o form control
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  maskCPF(event: any): void {
    const input = event.target;
    const value = input.value;
    const maskedValue = this.applyCpfMask(value);
    input.value = maskedValue;
    // Disparar evento de input para atualizar o form control
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  maskCNPJ(event: any): void {
    const input = event.target;
    const value = input.value;
    const maskedValue = this.applyCnpjMask(value);
    input.value = maskedValue;
    // Disparar evento de input para atualizar o form control
    const inputEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(inputEvent);
  }

  // Métodos de validação com nomes alternativos
  validateCPF(value: string): boolean {
    return this.isValidCpf(value);
  }

  validateCNPJ(value: string): boolean {
    return this.isValidCnpj(value);
  }

}