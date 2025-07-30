import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class UpdateCarteiraDto {
    @ApiProperty({ example: 'Nome da carteira' })
    @IsNotEmpty({ message: 'O nome da carteira é obrigatório' })
    @IsString({ message: 'O nome da carteira deve ser uma string' })
    @MaxLength(100, { message: 'O nome da carteira deve ter no máximo 100 caracteres' })
    nome: string;

    @ApiProperty({ example: 'COD123' })
    @IsNotEmpty({ message: 'O código da carteira é obrigatório' })
    @IsString({ message: 'O código da carteira deve ser uma string' })
    @MaxLength(10, { message: 'O código da carteira deve ter no máximo 10 caracteres' })
    codigo: string;
}