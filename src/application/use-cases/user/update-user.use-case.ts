import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserStatus, UserRole } from 'src/domain/entities/user';
import { UserUpdatedEvent } from 'src/domain/events/user-updated.event';

interface UpdateUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    id: number,
    name?: string,
    status?: UserStatus,
    userRole?: UserRole,
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
        if (!user) {
            throw new BadRequestException('invalid.user.not.found');
        }

        const updatedBy = await this.userRepository.findByAuthServiceUserId(authenticatedUser.id);

        user.update(updatedBy, name, status, userRole);

        const userUpdated = await this.userRepository.update(id, user);
        
        await this.eventBus.publish(
            new UserUpdatedEvent({
                user: userUpdated,
                authServiceUserId: user.authServiceUserId
            })
        );
        
        return userUpdated;
    }
}