import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { User } from 'src/domain/entities/user';

interface DeleteUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    id: string,
}

@Injectable()
export class DeleteUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute({
        authenticatedUser,
        id,
    }: DeleteUserUseCaseCommand): Promise<void> {
        const user = await this.userRepository.findById(id);

        // VALIDATION
        await this.validate(authenticatedUser, user);

        // USECASE LOGIC
        user.delete();
        await this.userRepository.update(id, user);
        
        // EVENT PUBLISHING
        await this.eventBus.publish(
            new UserDeletedEvent({
                authServiceUserId: user.authServiceUserId
            })
        );
    }

    private async validate(authenticatedUser: AuthenticatedUser, targetUser: User): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            DeleteUserUseCase.name,
            `${DeleteUserUseCase.name}_rules`,
            { 
                authenticatedUser,
                targetUser,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}