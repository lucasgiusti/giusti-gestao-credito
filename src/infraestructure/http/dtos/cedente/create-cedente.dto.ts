import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCedenteDto {
    @ApiProperty({ example: 'Nome do cedente' })
    @IsNotEmpty({ message: 'O nome do cedente é obrigatório' })
    @IsString({ message: 'O nome do cedente deve ser uma string' })
    nome: string;

    @ApiProperty({ example: 'Documento do cedente' })
    @IsNotEmpty({ message: 'O documento do cedente é obrigatório' })
    @IsString({ message: 'O documento do cedente deve ser uma string' })
    documento: string;
}