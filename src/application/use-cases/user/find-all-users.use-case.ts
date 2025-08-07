import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { IPaginationOptions, IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export interface IFindAllUsersUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllUsersUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(command: IFindAllUsersUseCaseCommand): Promise<IPaginatedResult<User>> {
        const paginationOptions: IPaginationOptions = {
            page: command.page ? Number(command.page) : undefined,
            limit: command.limit ? Number(command.limit) : undefined
        };
        
        const users = await this.userRepository.findAll(paginationOptions);
        return users;
    }
}