import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CarteiraResponseDto } from '../dtos/carteira/carteira-response.dto';
import { CreateCarteiraDto } from 'src/infraestructure/http/dtos/carteira/create-carteira.dto';
import { CreateCarteiraUseCase } from 'src/application/use-cases/carteira/create-carteira.use-case';
import { FindAllCarteirasUseCase } from 'src/application/use-cases/carteira/find-all-carteiras.use-case';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { Authenticated } from '../../decorators/authenticated.decorator';
import { AuthenticatedUser } from 'src/domain/entities/authenticated-user';

@ApiTags('v1/carteiras')
@Controller('v1/carteiras')
export class CarteiraController {

    constructor(
        private readonly createCarteiraUseCase: CreateCarteiraUseCase,
        private readonly findAllCarteirasUseCase: FindAllCarteirasUseCase,
    ) {}

    @Auth()
    @Post()
    @ApiOperation({ summary: 'Criar uma nova carteira', description: 'Cria uma nova carteira com os dados fornecidos' })
    @ApiResponse({ status: 201, description: 'Carteira criada com sucesso', type: CarteiraResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Authenticated() authenticatedUser: AuthenticatedUser, @Body() createCarteiraDto: CreateCarteiraDto): Promise<CarteiraResponseDto> {
        const carteira = await this.createCarteiraUseCase.execute({nome: createCarteiraDto.nome});
        return CarteiraResponseDto.fromEntity(carteira);
    }
    
    @Auth()
    @Get()
    @ApiOperation({ summary: 'Listar todas as carteiras', description: 'Retorna uma lista com todas as carteiras cadastradas' })
    @ApiResponse({ status: 200, description: 'Lista de carteiras retornada com sucesso', type: [CarteiraResponseDto] })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findAll(@Authenticated() authenticatedUser: AuthenticatedUser): Promise<CarteiraResponseDto[]> {
        const carteiras = await this.findAllCarteirasUseCase.execute({});
        return CarteiraResponseDto.fromEntities(carteiras);
    }
}