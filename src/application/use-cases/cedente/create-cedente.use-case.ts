import { Injectable } from '@nestjs/common';
import { Cedente } from 'src/domain/entities/cedente';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';

interface CreateCedenteUseCaseCommand {
    nome: string,
    documento: string,
}

@Injectable()
export class CreateCedenteUseCase {

    constructor(
        private cedenteRepository: ICedenteRepository
    ) {}

    async execute({
        nome,
        documento,
    }: CreateCedenteUseCaseCommand): Promise<Cedente> {

        const cedenteExists = await this.cedenteRepository.findByDocumento(documento);
        if (cedenteExists) {
            throw new Error('invalid.cedente.documento.exists');
        }

        const cedente = Cedente.create({nome, documento});
        const cedenteCreated = await this.cedenteRepository.create(cedente);

        return cedenteCreated;
    }
}