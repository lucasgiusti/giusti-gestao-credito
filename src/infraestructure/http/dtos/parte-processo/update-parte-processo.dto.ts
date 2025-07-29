import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNumber, IsUUID, IsNotEmpty } from "class-validator";

export class UpdateParteProcessoDto {
    @ApiProperty({ example: 'uuid-do-processo' })
    @IsNotEmpty({ message: 'O ID do processo é obrigatório' })
    @IsUUID('4', { message: 'O ID do processo deve ser um UUID válido' })
    processoId: string;

    @ApiProperty({ example: 'uuid-do-cedente' })
    @IsNotEmpty({ message: 'O ID do cedente é obrigatório' })
    @IsUUID('4', { message: 'O ID do cedente deve ser um UUID válido' })
    cedenteId: string;

    @ApiProperty({ example: 5000.00 })
    @IsNotEmpty({ message: 'O valor é obrigatório' })
    @IsNumber({}, { message: 'O valor deve ser um número' })
    valor: number;

    @ApiProperty({ example: 0.5 })
    @IsNotEmpty({ message: 'O percentual é obrigatório' })
    @IsNumber({}, { message: 'O percentual deve ser um número' })
    percentual: number;
}
