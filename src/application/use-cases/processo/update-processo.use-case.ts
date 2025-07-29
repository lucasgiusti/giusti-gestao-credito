import { Injectable } from '@nestjs/common';
import { Processo, TipoProcesso } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';

interface UpdateProcessoUseCaseCommand {
    id: string;
    numero?: string;
    carteiraId?: string;
    valorPedido?: number;
    valorHomologado?: number;
    tipo?: TipoProcesso;
}

@Injectable()
export class UpdateProcessoUseCase {

    constructor(
        private processoRepository: IProcessoRepository,
        private carteiraRepository: ICarteiraRepository
    ) {}

    async execute({
        id,
        numero,
        carteiraId,
        valorPedido,
        valorHomologado,
        tipo
    }: UpdateProcessoUseCaseCommand): Promise<Processo> {
        const processo = await this.processoRepository.findById(id);
        if (!processo) {
            throw new Error('notfound.processo');
        }

        if (carteiraId) {
            const carteira = await this.carteiraRepository.findById(carteiraId);
            if (!carteira) {
                throw new Error('notfound.carteira');
            }
        }

        const processoExists = await this.processoRepository.findByNumero(numero);

        processo.update({
            numero,
            carteiraId,
            valorPedido,
            valorHomologado,
            tipo,
            processoExists
        });

        return await this.processoRepository.update(id, processo);
    }
}
