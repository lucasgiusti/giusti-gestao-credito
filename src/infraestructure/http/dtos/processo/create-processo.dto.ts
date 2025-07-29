import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsUUID } from "class-validator";
import { TipoProcesso } from "src/domain/entities/processo";

export class CreateProcessoDto {
    @ApiProperty({ example: '12345-67.2023.8.26.0100' })
    @IsNotEmpty({ message: 'O número do processo é obrigatório' })
    @IsString({ message: 'O número do processo deve ser uma string' })
    numero: string;

    @ApiProperty({ example: 'uuid-da-carteira' })
    @IsNotEmpty({ message: 'O ID da carteira é obrigatório' })
    @IsUUID('4', { message: 'O ID da carteira deve ser um UUID válido' })
    carteiraId: string;

    @ApiProperty({ example: 10000.00 })
    @IsNotEmpty({ message: 'O valor do pedido é obrigatório' })
    @IsNumber({}, { message: 'O valor do pedido deve ser um número' })
    valorPedido: number;

    @ApiProperty({ example: 8000.00 })
    @IsNotEmpty({ message: 'O valor homologado é obrigatório' })
    @IsNumber({}, { message: 'O valor homologado deve ser um número' })
    valorHomologado: number;

    @ApiProperty({ enum: TipoProcesso, example: TipoProcesso.JUDICIAL })
    @IsNotEmpty({ message: 'O tipo do processo é obrigatório' })
    @IsEnum(TipoProcesso, { message: 'O tipo do processo deve ser um valor válido' })
    tipo: TipoProcesso;
}
