import { Documento, DocumentoTipo, CPF, CNPJ, DocumentoFactory } from './documento';

describe('Documento Value Object', () => {
  describe('CPF', () => {
    it('deve criar um CPF válido', () => {
      const cpf = new CPF('123.456.789-09');
      expect(cpf).toBeDefined();
      expect(cpf.type).toBe(DocumentoTipo.CPF);
      expect(cpf.value).toBe('12345678909');
    });

    it('deve formatar um CPF corretamente', () => {
      const cpf = new CPF('12345678909');
      expect(cpf.format()).toBe('123.456.789-09');
    });

    it('deve rejeitar um CPF inválido', () => {
      expect(() => new CPF('123.456.789-00')).toThrow();
      expect(() => new CPF('111.111.111-11')).toThrow();
      expect(() => new CPF('123')).toThrow();
    });

    it('deve validar CPFs conhecidos como válidos', () => {
      // CPFs válidos para teste
      const cpfsValidos = [
        '529.982.247-25', // Substitua por CPFs válidos
        '111.444.777-35',
        '123.456.789-09'
      ];

      cpfsValidos.forEach(cpfValido => {
        const cpf = new CPF(cpfValido);
        expect(cpf.isValid()).toBe(true);
      });
    });

    it('deve verificar igualdade entre CPFs', () => {
      const cpf1 = new CPF('529.982.247-25');
      const cpf2 = new CPF('52998224725');
      const cpf3 = new CPF('123.456.789-09');

      expect(cpf1.equals(cpf2)).toBe(true);
      expect(cpf1.equals(cpf3)).toBe(false);
    });
  });

  describe('CNPJ', () => {
    it('deve criar um CNPJ válido', () => {
      const cnpj = new CNPJ('12.345.678/0001-95');
      expect(cnpj).toBeDefined();
      expect(cnpj.type).toBe(DocumentoTipo.CNPJ);
      expect(cnpj.value).toBe('12345678000195');
    });

    it('deve formatar um CNPJ corretamente', () => {
      const cnpj = new CNPJ('12345678000195');
      expect(cnpj.format()).toBe('12.345.678/0001-95');
    });

    it('deve rejeitar um CNPJ inválido', () => {
      expect(() => new CNPJ('12.345.678/0001-00')).toThrow();
      expect(() => new CNPJ('11.111.111/1111-11')).toThrow();
      expect(() => new CNPJ('123')).toThrow();
    });

    it('deve validar CNPJs conhecidos como válidos', () => {
      // CNPJs válidos para teste
      const cnpjsValidos = [
        '45.997.418/0001-53', // Substitua por CNPJs válidos
        '11.222.333/0001-81',
        '12.345.678/0001-95'
      ];

      cnpjsValidos.forEach(cnpjValido => {
        const cnpj = new CNPJ(cnpjValido);
        expect(cnpj.isValid()).toBe(true);
      });
    });

    it('deve verificar igualdade entre CNPJs', () => {
      const cnpj1 = new CNPJ('45.997.418/0001-53');
      const cnpj2 = new CNPJ('45997418000153');
      const cnpj3 = new CNPJ('12.345.678/0001-95');

      expect(cnpj1.equals(cnpj2)).toBe(true);
      expect(cnpj1.equals(cnpj3)).toBe(false);
    });
  });

  describe('DocumentoFactory', () => {
    it('deve criar um CPF quando receber 11 dígitos', () => {
      const documento = DocumentoFactory.create('529.982.247-25');
      expect(documento.type).toBe(DocumentoTipo.CPF);
    });

    it('deve criar um CNPJ quando receber 14 dígitos', () => {
      const documento = DocumentoFactory.create('45.997.418/0001-53');
      expect(documento.type).toBe(DocumentoTipo.CNPJ);
    });

    it('deve rejeitar documentos com formato inválido', () => {
      expect(() => DocumentoFactory.create('123')).toThrow();
      expect(() => DocumentoFactory.create('')).toThrow();
    });
  });

  describe('Documento base', () => {
    it('deve converter para JSON corretamente', () => {
      const cpf = new CPF('529.982.247-25');
      const json = cpf.toJSON();
      
      expect(json).toEqual({
        value: '52998224725',
        type: DocumentoTipo.CPF
      });
    });

    it('deve converter para string corretamente', () => {
      const cpf = new CPF('529.982.247-25');
      expect(cpf.toString()).toBe('529.982.247-25');
      
      const cnpj = new CNPJ('45.997.418/0001-53');
      expect(cnpj.toString()).toBe('45.997.418/0001-53');
    });
  });
});
