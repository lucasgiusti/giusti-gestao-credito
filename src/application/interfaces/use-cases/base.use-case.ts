import { MultiStageValidationRegistry } from "src/application/validations/registry/multi-stage.registry";
import { ValidationError } from "src/application/errors/validation.error";

// BaseUseCase.ts
export abstract class BaseUseCase<TCommand, TResult> {
    protected abstract get validationId(): string;
    
    protected async validate(command: TCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            this.validationId,
            `${this.validationId}_rules`,
            command
        );
        if (validate.isFailure) {
            throw new ValidationError(validate.errors);
        }
    }

    abstract execute(command: TCommand): Promise<TResult>;
}