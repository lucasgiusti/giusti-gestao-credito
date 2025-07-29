import { Injectable } from '@nestjs/common';
import { Processo, TipoProcesso } from 'src/domain/entities/processo';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';

interface CreateProcessoUseCaseCommand {
    numero: string;
    carteiraId: string;
    valorPedido: number;
    valorHomologado: number;
    tipo: TipoProcesso;
}

@Injectable()
export class CreateProcessoUseCase {

    constructor(
        private processoRepository: IProcessoRepository,
        private carteiraRepository: ICarteiraRepository,
        private cedenteRepository: ICedenteRepository,
        private parteProcessoRepository: IParteProcessoRepository
    ) {}

    async execute({
        numero,
        carteiraId,
        valorPedido,
        valorHomologado,
        tipo,
    }: CreateProcessoUseCaseCommand): Promise<Processo> {
        const carteira = await this.carteiraRepository.findById(carteiraId);
        if (!carteira) {
            throw new Error('notfound.carteira');
        }

        const processoExists = await this.processoRepository.findByNumero(numero);

        const processo = Processo.create({
            numero,
            carteiraId,
            valorPedido,
            valorHomologado,
            tipo,
            processoExists,
        });

        const processoCreated = await this.processoRepository.create(processo);

        return processoCreated;
    }
}
