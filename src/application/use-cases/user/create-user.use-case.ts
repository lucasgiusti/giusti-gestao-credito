import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';

interface CreateUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    name: string,
}
@Injectable()
export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute({
        authenticatedUser,
        name,
    }: CreateUserUseCaseCommand): Promise<User> {

        // VALIDATION
        await this.validate(authenticatedUser);

        // USECASE LOGIC
        const user = User.createFromAuthUser({
            name,
            email: authenticatedUser.email,
            authServiceUserId: authenticatedUser.id,
        });
        const userCreated = await this.userRepository.create(user);
        
        // EVENT PUBLISHING
        await this.eventBus.publish(
            new UserCreatedEvent({
                user: userCreated,
                authServiceUserId: userCreated.authServiceUserId
            })
        );
        
        return userCreated;
    }

    private async validate(authenticatedUser: AuthenticatedUser): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            CreateUserUseCase.name,
            `${CreateUserUseCase.name}_rules`,
            { 
                email: authenticatedUser.email,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}