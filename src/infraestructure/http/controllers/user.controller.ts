import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserUseCase } from 'src/application/use-cases/user/create-user.use-case';
import { User } from 'src/domain/entities/user';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { Authenticated } from '../../decorators/authenticated.decorator';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';
import { FindAllUsersUseCase } from 'src/application/use-cases/user/find-all-users.use-case';
import { UserResponseDto } from '../dtos/user/user-response.dto';
import { UpdateUserUseCase } from 'src/application/use-cases/user/update-user.use-case';
import { UpdateUserDto } from '../dtos/user/update-user.dto';
import { FindUserByIdUseCase } from 'src/application/use-cases/user/find-user-by-id.use-case';
import { DeleteUserUseCase } from 'src/application/use-cases/user/delete-user.use-case';

@ApiTags('v1/users')
@Controller('v1/users')
export class UserController {

    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findAllUsersUseCase: FindAllUsersUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly findUserByIdUseCase: FindUserByIdUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase,
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

    @Auth('MASTER', 'ADMIN')
    @Put(':id')
    @ApiOperation({ summary: 'Atualizar um usuário', description: 'Atualiza um usuário com base nos dados do usuário autenticado' })
    @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso proibido' })
    async update(@Authenticated() authenticatedUser: AuthenticatedUser, @Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        const user = await this.updateUserUseCase.execute({
            authenticatedUser,
            id,
            name: updateUserDto.name,
            status: updateUserDto.status,
            userRole: updateUserDto.userRole,
        });
        return UserResponseDto.fromEntity(user);
    }

    @Auth('MASTER', 'ADMIN')
    @Get(':id')
    @ApiOperation({ summary: 'Buscar um usuário por ID', description: 'Retorna um usuário com base no ID fornecido' })
    @ApiResponse({ status: 200, description: 'Usuário encontrado com sucesso', type: UserResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso proibido' })
    async findById(@Param('id') id: number): Promise<UserResponseDto> {
        const user = await this.findUserByIdUseCase.execute({ id });
        return UserResponseDto.fromEntity(user);
    }

    @Auth('MASTER', 'ADMIN')
    @Delete(':id')
    @ApiOperation({ summary: 'Deletar um usuário', description: 'Deleta um usuário com base no ID fornecido' })
    @ApiResponse({ status: 204, description: 'Usuário deletado com sucesso' })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiResponse({ status: 403, description: 'Acesso proibido' })
    async delete(@Param('id') id: number): Promise<void> {
        await this.deleteUserUseCase.execute({ id });
    }
}