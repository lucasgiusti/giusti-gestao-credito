import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User, UserRole, UserStatus } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface ICreateUserUseCaseCommand {
    name: string,
    email: string,
    authServiceUserId: string,
}

@Injectable()
export class CreateUserUseCase extends BaseUseCase<ICreateUserUseCaseCommand, User> {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.USER_CREATE;
    }

    async execute(command: ICreateUserUseCaseCommand): Promise<User> {
        // VALIDATION
        await this.validate(command);

        // USECASE LOGIC
        const userProps = {
            ...command,
            userRole: UserRole.USER,
            status: UserStatus.INACTIVE
        };
        
        const user = User.createFromAuthUser(userProps);
        const userCreated = await this.userRepository.create(user);
        
        // EVENT PUBLISHING
        await this.sendEvent(userCreated);
        
        // RETURN
        return userCreated;
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