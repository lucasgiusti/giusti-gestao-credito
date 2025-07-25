import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateCarteiraDto {
    @ApiProperty({ example: 'Nome da carteira' })
    @IsNotEmpty({ message: 'O nome da carteira é obrigatório' })
    @IsString({ message: 'O nome da carteira deve ser uma string' })
    nome: string;
}