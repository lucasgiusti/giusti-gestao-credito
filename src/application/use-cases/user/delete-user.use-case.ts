import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { DeleteUserCommand } from './user.command';

@Injectable()
export class DeleteUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute(command: DeleteUserCommand): Promise<void> {
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

    private async validate(command: DeleteUserCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            DeleteUserUseCase.name,
            `${DeleteUserUseCase.name}_rules`,
            command
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}