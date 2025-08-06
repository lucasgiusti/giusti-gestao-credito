import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserUpdatedEvent } from 'src/domain/events/user-updated.event';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { UpdateUserCommand } from './user.command';

@Injectable()
export class UpdateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute(command: UpdateUserCommand): Promise<User> {
        const user = await this.userRepository.findById(command.id);
        if (!user) {
            throw new Error('notfound.user');
        }

        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        user.update(command);
        const userUpdated = await this.userRepository.update(command.id, user);
        
        // EVENT PUBLISHING
        await this.sendEvent(userUpdated);
        
        // RETURN
        return userUpdated;
    }

    private async validate(command: UpdateUserCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            UpdateUserUseCase.name,
            `${UpdateUserUseCase.name}_rules`,
            command
        );

        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }

    private async sendEvent(userUpdated: User): Promise<void> {
        await this.eventBus.publish(
            new UserUpdatedEvent({
                user: userUpdated,
                authServiceUserId: userUpdated.authServiceUserId
            })
        );
    }
}