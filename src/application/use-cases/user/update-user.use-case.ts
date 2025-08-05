import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserStatus, UserRole } from 'src/domain/entities/user';
import { UserUpdatedEvent } from 'src/domain/events/user-updated.event';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';

interface UpdateUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    id: string,
    name?: string,
    userRole?: UserRole,
    status?: UserStatus,
}

@Injectable()
export class UpdateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute({
        authenticatedUser,
        id,
        name,
        status,
        userRole,
    }: UpdateUserUseCaseCommand): Promise<User> {
        const user = await this.userRepository.findById(id);

        // VALIDATION
        await this.validate(authenticatedUser, user, userRole, status);

        // USECASE LOGIC
        user.update({ name, status, userRole });
        const userUpdated = await this.userRepository.update(id, user);
        
        // EVENT PUBLISHING
        await this.eventBus.publish(
            new UserUpdatedEvent({
                user: userUpdated,
                authServiceUserId: user.authServiceUserId
            })
        );
        
        return userUpdated;
    }

    private async validate(authenticatedUser: AuthenticatedUser, targetUser: User, userRole: UserRole, status: UserStatus): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            UpdateUserUseCase.name,
            `${UpdateUserUseCase.name}_rules`,
            { 
                authenticatedUser, 
                targetUser, 
                userRole, 
                status
            }
        );

        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}