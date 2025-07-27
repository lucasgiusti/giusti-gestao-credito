import { Injectable } from '@nestjs/common';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';

interface DeleteCedenteUseCaseCommand {
    id: number,
}

@Injectable()
export class DeleteCedenteUseCase {

    constructor(
        private readonly cedenteRepository: ICedenteRepository,
    ) {}

    async execute({
        id,
    }: DeleteCedenteUseCaseCommand): Promise<void> {
        const cedente = await this.cedenteRepository.findById(id);
        if (!cedente) {
            throw new Error('invalid.cedente.not.found');
        }

        cedente.canBeDeleted();

        await this.cedenteRepository.delete(id);
    }
}