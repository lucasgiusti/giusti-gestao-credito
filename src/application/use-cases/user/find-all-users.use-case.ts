import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { PaginationOptions, PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

interface FindAllUsersUseCaseCommand {
    page?: number;
    limit?: number;
}

@Injectable()
export class FindAllUsersUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute({ page, limit }: FindAllUsersUseCaseCommand): Promise<PaginatedResult<User>> {
        const paginationOptions: PaginationOptions = {
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined
        };
        
        const users = await this.userRepository.findAll(paginationOptions);
        return users;
    }
}