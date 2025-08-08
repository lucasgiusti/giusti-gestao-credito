import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { ProcessoCsv } from 'src/domain/entities/processo-csv';
import { CreateProcessoUseCase } from '../processo/create-processo.use-case';
import { CreateCedenteUseCase } from '../cedente/create-cedente.use-case';
import { ICedenteRepository } from 'src/application/interfaces/repositories/cedente.repository.interface';
import { TipoProcesso } from 'src/domain/entities/processo';
import { ICarteiraRepository } from 'src/application/interfaces/repositories/carteira.repository.interface';
import { CreateParteProcessoUseCase } from '../parte-processo/create-parte-processo.use-case';
import { IProcessoRepository } from 'src/application/interfaces/repositories/processo.repository.interface';
import { ErrorMessages } from 'src/application/validations/constants/error.messages';

interface ImportProcessoCsvUseCaseCommand {
    buffer: Buffer;
}

@Injectable()
export class ImportProcessoCsvUseCase {
    constructor(
        private readonly createProcessoUseCase: CreateProcessoUseCase,
        private readonly createCedenteUseCase: CreateCedenteUseCase,
        private readonly cedenteRepository: ICedenteRepository,
        private readonly processoRepository: IProcessoRepository,
        private readonly carteiraRepository: ICarteiraRepository,
        private readonly createParteProcessoUseCase: CreateParteProcessoUseCase
    ) {}

    async execute({
        buffer,
    }: ImportProcessoCsvUseCaseCommand): Promise<ProcessoCsv[]> {
        const rawResults = await this.processarCsv(buffer);
        
        const processoCsvEntities = rawResults.map(rawData => ProcessoCsv.create(rawData));
        
        for (const processoCsv of processoCsvEntities) {
            try {
            
                if (!processoCsv.isValid()) {
                    console.error(ErrorMessages.PROCESSO_NUMERO_INVALIDO(processoCsv.processo));
                    continue;
                }

                const carteira = await this.carteiraRepository.findByCodigo(processoCsv.carteira);
                if (!carteira) {
                    console.error(ErrorMessages.CARTEIRA_CODIGO_NAO_EXISTE(processoCsv.carteira));
                    continue;
                }

                let processo = await this.processoRepository.findByNumero(processoCsv.processo);
                if (!processo) {
                    processo = await this.createProcessoUseCase.execute({
                        numero: processoCsv.processo,
                        carteiraId: carteira.id,
                        valorPedido: processoCsv.valorPedido,
                        valorHomologado: processoCsv.valorHomologado,
                        tipo: processoCsv.tipo as TipoProcesso
                    });
                }

                let cedente = await this.cedenteRepository.findByDocumento(processoCsv.documento);
                if (!cedente) {
                    cedente = await this.createCedenteUseCase.execute({
                        nome: processoCsv.cedente,
                        documento: processoCsv.documento
                    });
                }

                await this.createParteProcessoUseCase.execute({
                    processoId: processo.id,
                    cedenteId: cedente.id,
                    percentual: processoCsv.aquisicao
                });
            } catch (error) {
                console.error(ErrorMessages.PROCESSO_ERRO_NO_IMPORT_CSV_NUMERO(processoCsv.processo), error);
                continue;
            }
        }
        
        return processoCsvEntities;
    }
    
    /**
     * Processa o arquivo CSV e retorna os registros
     * @param buffer Buffer do arquivo CSV
     * @returns Array de entidades ProcessoCsv
     */
    private async processarCsv(buffer: Buffer): Promise<ProcessoCsv[]> {
        return new Promise((resolve, reject) => {
            const results: ProcessoCsv[] = [];
        
            const stream = Readable.from(buffer.toString());
        
            stream
                .pipe(csv({
                    separator: ',',
                    mapHeaders: ({ header }) => {
                        switch (header.trim()) {
                            case 'Carteira': return 'carteira';
                            case 'Processo': return 'processo';
                            case 'Cota': return 'cota';
                            case 'Aquisicao': return 'aquisicao';
                            case 'Cedente / Beneficiário': return 'cedente';
                            case 'Documento': return 'documento';
                            case 'Valor Pedido': return 'valorPedido';
                            case 'Valor Homologado': return 'valorHomologado';
                            case 'Tipo': return 'tipo';
                            default: return header;
                        }
                    }
                }))
                .on('data', (data) => results.push(data))
                .on('end', () => {
                    resolve(results);
                })
                .on('error', (error) => {
                    reject(new Error(ErrorMessages.PROCESSO_ERRO_NO_IMPORT_CSV_NUMERO(error.message)));
                });
        });
    }
}
