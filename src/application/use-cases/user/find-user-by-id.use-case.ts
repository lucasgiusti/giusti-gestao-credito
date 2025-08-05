import { Injectable } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { User } from 'src/domain/entities/user';
import { MultiStageValidationRegistry } from 'src/application/validations/registry/multi-stage.registry';

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

        // VALIDATION
        await this.validate(user);

        return user;
    }

    private async validate(targetUser: User): Promise<void> {
        const validate = await MultiStageValidationRegistry.validate(
            FindUserByIdUseCase.name,
            `${FindUserByIdUseCase.name}_rules`,
            { 
                targetUser,
            }
        );
        if (validate.isFailure) {
            throw new Error(validate.error);
        }
    }
}