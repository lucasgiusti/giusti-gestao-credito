import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';

interface DeleteUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    id: number,
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
        if (!user) {
            throw new BadRequestException('invalid.user.not.found');
        }

        const updatedBy = await this.userRepository.findByAuthServiceUserId(authenticatedUser.id);

        user.delete(updatedBy);

        await this.userRepository.update(id, user);
        
        await this.eventBus.publish(
            new UserDeletedEvent({
                authServiceUserId: user.authServiceUserId
            })
        );
    }
}