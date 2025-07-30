/**
 * Entidade de domínio que representa um registro de processo importado de um CSV
 */
export class ProcessoCsv {
  private _carteira: string;
  private _processo: string;
  private _cota?: string;
  private _aquisicao: number;
  private _cedente: string;
  private _documento: string;
  private _valorPedido: number;
  private _valorHomologado: number;
  private _tipo: string;

  private constructor(props: {
    carteira: string;
    processo: string;
    cota?: string;
    aquisicao: number;
    cedente: string;
    documento: string;
    valorPedido: number;
    valorHomologado: number;
    tipo: string;
  }) {
    this._carteira = props.carteira;
    this._processo = props.processo;
    this._cota = props.cota;
    this._aquisicao = props.aquisicao;
    this._cedente = props.cedente;
    this._documento = props.documento;
    this._valorPedido = props.valorPedido;
    this._valorHomologado = props.valorHomologado;
    this._tipo = props.tipo;
  }

  /**
   * Cria uma nova instância de ProcessoCsv a partir de dados brutos do CSV
   */
  static create(rawData: {
    carteira: string;
    processo: string;
    cota?: string;
    aquisicao: string | number;
    cedente: string;
    documento: string;
    valorPedido: string | number;
    valorHomologado: string | number;
    tipo: string;
  }): ProcessoCsv {
    // Converter valores de string para número
    const valorPedido = this.parseValor(rawData.valorPedido);
    const valorHomologado = this.parseValor(rawData.valorHomologado);
    const aquisicao = this.parseValor(rawData.aquisicao);

    return new ProcessoCsv({
      carteira: rawData.carteira,
      processo: rawData.processo,
      cota: rawData.cota,
      aquisicao,
      cedente: rawData.cedente,
      documento: this.formatarDocumento(rawData.documento),
      valorPedido,
      valorHomologado,
      tipo: rawData.tipo,
    });
  }

  /**
   * Converte um valor em formato de string ou number para número
   */
  private static parseValor(valor: string | number): number {
    if (valor === null || valor === undefined) return 0;
    
    // Se já for um número, retorna diretamente
    if (typeof valor === 'number') return valor;
    
    // Se for string vazia
    if (valor === '') return 0;
    
    // Remove pontos e substitui vírgula por ponto para converter para número
    return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
  }

  /**
   * Formata o documento removendo caracteres especiais
   */
  private static formatarDocumento(documento: string): string {
    if (!documento) return '';
    
    // Remove caracteres não numéricos
    return documento.replace(/\D/g, '');
  }

  /**
   * Valida se o processo tem todos os dados obrigatórios
   */
  isValid(): boolean {
    return (
      !!this._carteira &&
      !!this._processo &&
      !!this._cedente &&
      !!this._documento &&
      this._valorPedido >= 0 &&
      this._valorHomologado >= 0 &&
      !!this._tipo
    );
  }

  // Getters
  get carteira(): string {
    return this._carteira;
  }

  get processo(): string {
    return this._processo;
  }

  get cota(): string | undefined {
    return this._cota;
  }

  get aquisicao(): number {
    return this._aquisicao;
  }

  get cedente(): string {
    return this._cedente;
  }

  get documento(): string {
    return this._documento;
  }

  get valorPedido(): number {
    return this._valorPedido;
  }

  get valorHomologado(): number {
    return this._valorHomologado;
  }

  get tipo(): string {
    return this._tipo;
  }

  /**
   * Converte a entidade para um objeto simples
   */
  toJSON() {
    return {
      carteira: this._carteira,
      processo: this._processo,
      cota: this._cota,
      aquisicao: this._aquisicao,
      cedente: this._cedente,
      documento: this._documento,
      valorPedido: this._valorPedido,
      valorHomologado: this._valorHomologado,
      tipo: this._tipo,
    };
  }
}
