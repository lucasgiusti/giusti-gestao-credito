import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class FindParteProcessoByProcessoIdAndIdDto {
    @ApiProperty({ example: 'uuid-do-processo' })
    @IsNotEmpty({ message: 'O ID do processo é obrigatório' })
    @IsUUID('4', { message: 'O ID do processo deve ser um UUID válido' })
    id: string;

    @ApiProperty({ example: 'uuid-do-parte-processo' })
    @IsNotEmpty({ message: 'O ID da parte do processo é obrigatório' })
    @IsUUID('4', { message: 'O ID da parte do processo deve ser um UUID válido' })
    parteProcessoId: string;
}
