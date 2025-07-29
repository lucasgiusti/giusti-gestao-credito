import { Injectable } from '@nestjs/common';
import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { IParteProcessoRepository } from 'src/application/interfaces/repositories/parte-processo.repository.interface';

@Injectable()
export class FindParteProcessoByIdUseCase {

    constructor(
        private parteProcessoRepository: IParteProcessoRepository
    ) {}

    async execute(id: string): Promise<ParteProcesso> {
        const parteProcesso = await this.parteProcessoRepository.findById(id);
        
        if (!parteProcesso) {
            throw new Error('notfound.parteProcesso');
        }

        return parteProcesso;
    }
}
