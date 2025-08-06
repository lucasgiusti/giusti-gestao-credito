import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { FindAllUsersCommand } from './user.command';

@Injectable()
export class FindAllUsersUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(command: FindAllUsersCommand): Promise<PaginatedResult<User>> {
        const paginationOptions: PaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const users = await this.userRepository.findAll(paginationOptions);
        return users;
    }
}