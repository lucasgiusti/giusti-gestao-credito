import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IFindUserByIdUseCaseCommand {
    id: string,
}

@Injectable()
export class FindUserByIdUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
    ) {}

    async execute(command: IFindUserByIdUseCaseCommand): Promise<User> {
        const user = await this.userRepository.findById(command.id);
        if (!user) {
            throw new Error(ErrorMessages.USER_NAO_EXISTE);
        }

        return user;
    }
}