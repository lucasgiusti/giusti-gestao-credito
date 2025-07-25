import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { UserRole, UserStatus } from "src/domain/entities/user";

export class UpdateUserDto {
    @ApiPropertyOptional({ required: false, example: 'Nome do usuário' })
    @IsString({ message: 'O nome do usuário deve ser uma string' })
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ required: false, examples: ['ACTIVE', 'INACTIVE'], example: 'ACTIVE' })
    @IsEnum(UserStatus, { message: 'O status do usuário deve ser uma string' })
    @IsOptional()
    status?: UserStatus;

    @ApiPropertyOptional({ required: false, examples: ['ADMIN', 'USER'], example: 'ADMIN' })
    @IsEnum(UserRole, { message: 'O role do usuário deve ser uma string' })
    @IsOptional()
    userRole?: UserRole;
}