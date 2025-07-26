import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from 'src/application/interfaces/repositories/user.repository.interface';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { Carteira } from 'src/domain/entities/carteira';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';

interface UpdateCarteiraUseCaseCommand {
    authenticatedUser: AuthenticatedUser,
    id: number,
    nome?: string,
}

@Injectable()
export class UpdateCarteiraUseCase {

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        authenticatedUser,
        id,
        nome,
    }: UpdateCarteiraUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(id);
        if (!carteira) {
            throw new BadRequestException('invalid.carteira.not.found');
        }

        const updatedBy = await this.userRepository.findByAuthServiceUserId(authenticatedUser.id);

        carteira.update(updatedBy, nome);

        const carteiraUpdated = await this.carteiraRepository.update(id, carteira);
        
        return carteiraUpdated;
    }
}