import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class FindProcessoByIdDto {
    @ApiProperty({ example: 'uuid-do-processo' })
    @IsNotEmpty({ message: 'O ID do processo é obrigatório' })
    @IsUUID('4', { message: 'O ID do processo deve ser um UUID válido' })
    id: string;
}
