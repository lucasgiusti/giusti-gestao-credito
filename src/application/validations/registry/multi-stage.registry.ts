import { IValidationSpecification } from 'src/application/interfaces/common/validation-specification.interface';

interface IValidationRule<T> {
  readonly name: string;
  readonly spec: IValidationSpecification<any>;
  getValue(command: T, context?: any): any;
}

export class MultiStageValidationRegistry {
  private static rules = new Map<
    string, // Nome do caso de uso (ex: 'updateUser')
    Map<
      string, // Nome do estágio (ex: 'PRE_CHECKS')
      Array<IValidationRule<any>>
    >
  >();

  /**
   * Registra uma validação para um estágio específico
   */
  static register<T>(
    useCase: string,
    stage: string,
    name: string,
    spec: IValidationSpecification<any>,
    getValue: (command: T, context?: any) => any
  ): void {
    if (!this.rules.has(useCase)) {
      this.rules.set(useCase, new Map());
    }

    const useCaseRules = this.rules.get(useCase)!;
    
    if (!useCaseRules.has(stage)) {
      useCaseRules.set(stage, []);
    }

    useCaseRules.get(stage)!.push({
      name,
      spec,
      getValue
    });
  }

  /**
   * Executa todas as validações de um estágio específico
   */
  static async validate<T>(
    useCase: string,
    stage: string,
    command: T,
    context?: any
  ): Promise<any> {
    const errors: string[] = [];
    const stageRules = this.rules.get(useCase)?.get(stage) || [];
    
    if (stageRules.length > 0) {
    }

    for (const rule of stageRules) {
      try {
        const value = rule.getValue(command, context);
        const isValid = await rule.spec.isSatisfiedBy(value, context);
        
        if (!isValid) {
          errors.push(rule.name);
        }
      } catch (error) {
        errors.push(`${rule.name} (validation error)`);
      }
    }

    return { 
      isFailure: errors.length > 0,
      errors,
    };
  }

  /**
   * Obtém todos os estágios registrados para um caso de uso
   */
  static getStages(useCase: string): string[] {
    return Array.from(this.rules.get(useCase)?.keys() || []);
  }

  /**
   * Limpa todas as validações (útil para testes)
   */
  static clear(): void {
    this.rules.clear();
  }
}

export class ValidationHelper {
  static registerValidation<TCommand, TParams>(
    validationId: string,
      errorMessage: string,
      specification: any,
      paramExtractor: (cmd: TCommand) => TParams
  ): void {
      MultiStageValidationRegistry.register(
        validationId,
        `${validationId}_rules`,
        errorMessage,
        specification,
        paramExtractor
    );
  }
}