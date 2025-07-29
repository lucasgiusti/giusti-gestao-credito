import { ApiProperty } from "@nestjs/swagger";
import { ParteProcesso } from "src/domain/entities/parte-processo";
import { CedenteResponseDto } from "../cedente/cedente-response.dto";
import { ProcessoSimpleResponseDto } from "../processo/processo-simple-response.dto";

export class ParteProcessoResponseDto {
    @ApiProperty({ example: 'uuid-da-parte-processo' })
    id: string;

    @ApiProperty({ example: 'uuid-do-processo' })
    processoId: string;

    @ApiProperty({ example: 'uuid-do-cedente' })
    cedenteId: string;

    @ApiProperty({ example: 5000.00 })
    valor: number;

    @ApiProperty({ example: 0.5 })
    percentual: number;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    createdAt: Date;

    @ApiProperty({ example: '2023-01-01T00:00:00.000Z' })
    updatedAt: Date;

    @ApiProperty({ type: () => CedenteResponseDto, nullable: true })
    cedente?: CedenteResponseDto;

    @ApiProperty({ type: () => ProcessoSimpleResponseDto, nullable: true })
    processo?: ProcessoSimpleResponseDto;

    constructor(parteProcesso: ParteProcesso) {
        this.id = parteProcesso.id;
        this.processoId = parteProcesso.processoId;
        this.cedenteId = parteProcesso.cedenteId;
        this.valor = parteProcesso.valor;
        this.percentual = parteProcesso.percentual;
        this.createdAt = parteProcesso.createdAt;
        this.updatedAt = parteProcesso.updatedAt;
        this.cedente = parteProcesso.cedente ? CedenteResponseDto.fromEntity(parteProcesso.cedente) : null;
        this.processo = parteProcesso.processo ? ProcessoSimpleResponseDto.fromEntity(parteProcesso.processo) : null;
    }

    static fromEntity(parteProcesso: ParteProcesso): ParteProcessoResponseDto {
        return new ParteProcessoResponseDto(parteProcesso);
    }

    static fromEntities(partesProcesso: ParteProcesso[]): ParteProcessoResponseDto[] {
        return partesProcesso.map(parteProcesso => ParteProcessoResponseDto.fromEntity(parteProcesso));
    }
}
