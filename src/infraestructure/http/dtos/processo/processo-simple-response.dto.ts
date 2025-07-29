import { ApiProperty } from "@nestjs/swagger";
import { Processo, TipoProcesso } from "src/domain/entities/processo";

export class ProcessoSimpleResponseDto {
    @ApiProperty({ example: 'uuid-do-processo' })
    id: string;

    @ApiProperty({ example: '12345-67.2023.8.26.0100' })
    numero: string;

    @ApiProperty({ example: 'uuid-da-carteira' })
    carteiraId: string;

    @ApiProperty({ example: 10000.00 })
    valorPedido: number;

    @ApiProperty({ example: 8000.00 })
    valorHomologado: number;

    @ApiProperty({ enum: TipoProcesso, example: TipoProcesso.JUDICIAL })
    tipo: TipoProcesso;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updatedAt: Date;

    constructor(processo: Processo) {
        this.id = processo.id;
        this.numero = processo.numero;
        this.carteiraId = processo.carteiraId;
        this.valorPedido = processo.valorPedido;
        this.valorHomologado = processo.valorHomologado;
        this.tipo = processo.tipo;
        this.createdAt = processo.createdAt;
        this.updatedAt = processo.updatedAt;
    }

    static fromEntity(processo: Processo): ProcessoSimpleResponseDto {
        if (!processo) return null;
        return new ProcessoSimpleResponseDto(processo);
    }
}
