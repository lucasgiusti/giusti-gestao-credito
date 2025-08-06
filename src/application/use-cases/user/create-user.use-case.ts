import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { CreateUserCommand } from './user.command';

@Injectable()
export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute(command: CreateUserCommand): Promise<User> {
        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const user = User.createFromAuthUser(command);
        const userCreated = await this.userRepository.create(user);
        
        // EVENT PUBLISHING
        await this.sendEvent(userCreated);
        
        // RETURN
        return userCreated;
    }

    private async validate(command: CreateUserCommand): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            CreateUserUseCase.name,
            `${CreateUserUseCase.name}_rules`,
            command
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }

    private async sendEvent(userCreated: User): Promise<void> {
        await this.eventBus.publish(
            new UserCreatedEvent({
                user: userCreated,
                authServiceUserId: userCreated.authServiceUserId
            })
        );
    }
}