import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User, UserRole, UserStatus } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserUpdatedEvent } from 'src/domain/events/user-updated.event';
import { BaseUseCase } from 'src/application/interfaces/use-cases/base.use-case';
import { ValidationIdentifiers } from 'src/application/validations/constants/validation-identifiers';

export interface IUpdateUserUseCaseCommand {
    authServiceUserId: string,
    id: string,
    email: string,
    name: string,
    userRole: UserRole,
    status: UserStatus,
}

@Injectable()
export class UpdateUserUseCase extends BaseUseCase<IUpdateUserUseCaseCommand, User> {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {
        super();
    }

    protected get validationId(): string {
        return ValidationIdentifiers.USER_UPDATE;
    }

    async execute(command: IUpdateUserUseCaseCommand): Promise<User> {
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

    private async sendEvent(userUpdated: User): Promise<void> {
        await this.eventBus.publish(
            new UserUpdatedEvent({
                user: userUpdated,
                authServiceUserId: userUpdated.authServiceUserId
            })
        );
    }
}