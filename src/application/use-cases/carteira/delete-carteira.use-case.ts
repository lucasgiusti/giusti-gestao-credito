import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';

interface DeleteCarteiraUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
    ) {}

    async execute({
        id,
    }: DeleteCarteiraUseCaseCommand): Promise<void> {
        const carteira = await this.carteiraRepository.findById(id);
        if (!carteira) {
            throw new Error('invalid.carteira.not.found');
        }

        carteira.canBeDeleted();

        await this.carteiraRepository.delete(id);
    }
}