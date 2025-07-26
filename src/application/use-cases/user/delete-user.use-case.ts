import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserDeletedEvent } from 'src/domain/events/user-deleted.event';

interface DeleteUserUseCaseCommand {
    id: number,
}

@Injectable()
export class DeleteUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute({
        id,
    }: DeleteUserUseCaseCommand): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new BadRequestException('invalid.user.not.found');
        }

        await this.userRepository.delete(id);
        
        await this.eventBus.publish(
            new UserDeletedEvent({
                authServiceUserId: user.authServiceUserId
            })
        );
    }
}