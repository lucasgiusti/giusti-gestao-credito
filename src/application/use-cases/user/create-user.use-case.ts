import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { User } from 'src/domain/entities/user';
import { EventBusService } from 'src/infraestructure/events/event-bus.service';
import { UserCreatedEvent } from 'src/domain/events/user-created.event';

interface CreateUserUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
}

@Injectable()
export class CreateUserUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService,
    ) {}

    async execute({
        authenticatedUser,
    }: CreateUserUseCaseCommand): Promise<User> {
        const userExists = await this.userRepository.findByEmail(authenticatedUser.email);
        if (userExists) {
            throw new Error('invalid.user.already.exists');
        }

        const user = User.createFromAuthUser({
            name: authenticatedUser.email.split('@')[0],
            email: authenticatedUser.email,
            authServiceUserId: authenticatedUser.id
        });

        const userCreated = await this.userRepository.create(user);
        
        await this.eventBus.publish(
            new UserCreatedEvent({
                user: userCreated,
                authServiceUserId: userCreated.authServiceUserId
            })
        );
        
        return userCreated;
    }
}