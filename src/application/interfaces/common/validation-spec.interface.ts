export interface IValidationSpec<T> {
    /**
     * Verifica se o valor satisfaz a especificação
     * @param value Valor a ser validado
     * @param context Contexto adicional (opcional)
     */
    isSatisfiedBy(value: T, context?: any): Promise<boolean> | boolean;
  }