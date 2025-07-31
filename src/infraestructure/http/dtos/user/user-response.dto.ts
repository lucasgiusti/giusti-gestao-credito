import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole, UserStatus } from 'src/domain/entities/user';
import { PaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { PaginatedResultDto } from '../common/paginated-result.dto';

export class UserResponseDto {
  @ApiProperty({ description: 'ID do usuário' })
  id: string;

  @ApiProperty({ description: 'Nome do usuário' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  email: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.ADMIN
  })
  userRole: UserRole;

  @ApiProperty({ 
    description: 'Status do usuário no sistema',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  status: UserStatus;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.userRole = user.userRole;
    this.status = user.status;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromEntity(user: User): UserResponseDto {
    return new UserResponseDto(user);
  }

  static fromEntities(users: User[] | PaginatedResult<User>): UserResponseDto[] | PaginatedResultDto< UserResponseDto> {
    if (Array.isArray(users)) {
      return users.map(user => UserResponseDto.fromEntity(user));
    } else {
      // É um resultado paginado
      return PaginatedResultDto.fromPaginatedResult(users, (user) => UserResponseDto.fromEntity(user));
    }
  }
}
