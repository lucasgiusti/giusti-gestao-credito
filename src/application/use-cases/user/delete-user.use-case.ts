import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IDeleteUserUseCaseCommand {
    authServiceUserId: string,
    id: string,
}

@Injectable()
export class DeleteUserUseCase extends BaseUseCase<IDeleteUserUseCaseCommand, void> {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.USER_DELETE;
    }

    async execute(command: IDeleteUserUseCaseCommand): Promise<void> {
        const user = await this.userRepository.findById(command.id);
        if (!user) {
            throw new Error('notfound.user');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        user.delete();
        await this.userRepository.update(command.id, user);
        
        // EVENT PUBLISHING
        await this.eventBus.publish(
            new UserDeletedEvent({
                authServiceUserId: user.authServiceUserId
            })
        );
    }
}