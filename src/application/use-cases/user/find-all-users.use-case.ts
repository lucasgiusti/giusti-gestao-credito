import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';

interface FindAllUsersUseCaseCommand {}

@Injectable()
export class FindAllUsersUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute({}: FindAllUsersUseCaseCommand): Promise<User[]> {
        const users = await this.userRepository.findAll();
        return users;
    }
}