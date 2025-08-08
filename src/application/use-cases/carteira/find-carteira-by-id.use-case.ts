import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { Carteira } from 'src/domain/entities/carteira';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

export interface IFindCarteiraByIdUseCaseCommand {
    id: string;
}

@Injectable()
export class FindCarteiraByIdUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute(command: IFindCarteiraByIdUseCaseCommand): Promise<Carteira> {
        const carteira = await this.carteiraRepository.findById(command.id);
        if (!carteira) {
            throw new Error(ErrorMessages.CARTEIRA_NAO_EXISTE);
        }

        return carteira;
    }
}