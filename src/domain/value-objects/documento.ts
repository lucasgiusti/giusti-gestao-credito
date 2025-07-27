// Tipo de documento
export enum DocumentoTipo {
  CPF = 'CPF',
  CNPJ = 'CNPJ'
}

// Interface para o objeto valor Documento
export interface IDocumento {
  value: string;
  type: DocumentoTipo;
  format(): string;
  isValid(): boolean;
}

// Classe abstrata base para Documento
export abstract class Documento implements IDocumento {
  protected _value: string;
  abstract type: DocumentoTipo;

  constructor(value: string) {
    // Remove formatação para armazenar apenas números
    this._value = value.replace(/\D/g, '');
    
    if (!this.isValid()) {
      throw new Error(`invalid.document`);
    }
  }

  get value(): string {
    return this._value;
  }

  abstract format(): string;
  
  abstract isValid(): boolean;
  
  equals(outro?: Documento): boolean {
    if (!outro) return false;
    return this.type === outro.type && this._value === outro._value;
  }
  
  toString(): string {
    return this.format();
  }
  
  toJSON(format?: boolean): { value: string, type: DocumentoTipo } {
    return {
      value: format ? this.format() : this._value,
      type: this.type
    };
  }
}

// Implementação específica para CPF
export class CPF extends Documento {
  type = DocumentoTipo.CPF;

  format(): string {
    return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  isValid(): boolean {
    const cpf = this._value;
    
    // CPF deve ter 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = soma % 11;
    let digitoVerificador1 = resto < 2 ? 0 : 11 - resto;
    
    if (parseInt(cpf.charAt(9)) !== digitoVerificador1) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = soma % 11;
    let digitoVerificador2 = resto < 2 ? 0 : 11 - resto;
    
    return parseInt(cpf.charAt(10)) === digitoVerificador2;
  }
  
  static create(value: string): CPF {
    return new CPF(value);
  }
}

// Implementação específica para CNPJ
export class CNPJ extends Documento {
  type = DocumentoTipo.CNPJ;

  format(): string {
    return this._value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  isValid(): boolean {
    const cnpj = this._value;
    
    // CNPJ deve ter 14 dígitos
    if (cnpj.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais (caso inválido)
    if (/^(\d)\1+$/.test(cnpj)) return false;
    
    // Validação do primeiro dígito verificador
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    const digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    return resultado === parseInt(digitos.charAt(1));
  }
  
  static create(value: string): CNPJ {
    return new CNPJ(value);
  }
}

// Factory para criar o tipo correto de documento
export class DocumentoFactory {
  static create(value: string): Documento {
    // Remove qualquer formatação para verificar apenas os números
    const apenasNumeros = value.replace(/\D/g, '');
    
    if (apenasNumeros.length === 11) {
      return new CPF(value);
    } else if (apenasNumeros.length === 14) {
      return new CNPJ(value);
    } else {
      throw new Error(`invalid.document`);
    }
  }
}
