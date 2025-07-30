import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ required: true, example: 'Nome do usuário' })
    @IsNotEmpty({ message: 'O nome do usuário deve ser informado' })
    @IsString({ message: 'O nome do usuário deve ser uma string' })
    name: string;
}