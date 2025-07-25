import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user.use-case';
import { User } from 'src/domain/entities/user';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { Authenticated } from '../../decorators/authenticated.decorator';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { FindAllUsersUseCase } from 'src/application/use-cases/user/find-all-users.use-case';
import { UserResponseDto } from '../dtos/user/user-response.dto';

@ApiTags('v1/users')
@Controller('v1/users')
export class UserController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findAllUsersUseCase: FindAllUsersUseCase,
    ) {}

    @Auth()
    @Post()
    @ApiOperation({ summary: 'Criar um novo usuário', description: 'Cria um novo usuário com base nos dados do usuário autenticado' })
    @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Authenticated() authenticatedUser: AuthenticatedUser): Promise<UserResponseDto> {
        const user = await this.createUserUseCase.execute({
            authenticatedUser,
        });
        return UserResponseDto.fromEntity(user);
    }

    @Auth('MASTER', 'ADMIN')
    @Get()
    @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna uma lista com todos os usuários cadastrados' })
    @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso', type: [UserResponseDto] })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso proibido' })
    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.findAllUsersUseCase.execute({});
        return UserResponseDto.fromEntities(users);
    }
}