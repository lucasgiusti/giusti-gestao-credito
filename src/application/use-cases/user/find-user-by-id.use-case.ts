import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';

interface FindUserByIdUseCaseCommand {
    id: string,
}

@Injectable()
export class FindUserByIdUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute({
        id,
    }: FindUserByIdUseCaseCommand): Promise<User> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('invalid.user.not.found');
        }

        return user;
    }
}