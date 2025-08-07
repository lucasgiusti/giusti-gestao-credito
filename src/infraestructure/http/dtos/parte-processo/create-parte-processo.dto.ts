import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class CreateParteProcessoDto {
    @ApiProperty({ example: 'uuid-do-cedente' })
    @IsNotEmpty({ message: 'O ID do cedente é obrigatório' })
    @IsUUID('4', { message: 'O ID do cedente deve ser um UUID válido' })
    cedenteId: string;

    @ApiProperty({ example: 0.5 })
    @IsNotEmpty({ message: 'O percentual é obrigatório' })
    @IsNumber({}, { message: 'O percentual deve ser um número' })
    percentual: number;
}
