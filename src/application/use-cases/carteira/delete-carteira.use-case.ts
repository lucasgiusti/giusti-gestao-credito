import { Injectable } from '@nestjs/common';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';

interface DeleteCarteiraUseCaseCommand {
    id: string,
}

@Injectable()
export class DeleteCarteiraUseCase {

    constructor(
        private readonly carteiraRepository: ICarteiraRepository,
        private readonly processoRepository: IProcessoRepository,
    ) {}

    async execute({
        id,
    }: DeleteCarteiraUseCaseCommand): Promise<void> {
        const carteira = await this.carteiraRepository.findById(id);
        if (!carteira) {
            throw new Error('invalid.carteira.not.found');
        }

        const existsProcessos = await this.processoRepository.existsByCarteiraId(id);

        carteira.canBeDeleted(existsProcessos);

        await this.carteiraRepository.delete(id);
    }
}