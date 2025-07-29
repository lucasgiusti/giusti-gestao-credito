import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';

interface FindAllPartesProcessoUseCaseCommand {
    
}
@Injectable()
export class FindAllPartesProcessoUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository,
    ) {}

    async execute({}: FindAllPartesProcessoUseCaseCommand): Promise<ParteProcesso[]> {
        return await this.parteProcessoRepository.findAll();
    }
}
