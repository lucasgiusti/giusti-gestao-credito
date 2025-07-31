import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { SwaggerPaginatedDto } from '../dtos/common/swagger-paginated.dto';
import { CarteiraResponseDto } from '../dtos/carteira/carteira-response.dto';
import { CreateCarteiraDto } from 'src/infraestructure/http/dtos/carteira/create-carteira.dto';
import { CreateCarteiraUseCase } from 'src/application/use-cases/carteira/create-carteira.use-case';
import { FindAllCarteirasUseCase } from 'src/application/use-cases/carteira/find-all-carteiras.use-case';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { UpdateCarteiraUseCase } from 'src/application/use-cases/carteira/update-carteira.use-case';
import { UpdateCarteiraDto } from 'src/infraestructure/http/dtos/carteira/update-carteira.dto';
import { FindCarteiraByIdUseCase } from 'src/application/use-cases/carteira/find-carteira-by-id.use-case';
import { DeleteCarteiraUseCase } from 'src/application/use-cases/carteira/delete-carteira.use-case';

@ApiTags('carteiras')
@ApiExtraModels(SwaggerPaginatedDto(CarteiraResponseDto))
@Controller('carteiras')
export class CarteiraController {

    constructor(
        private readonly createCarteiraUseCase: CreateCarteiraUseCase,
        private readonly findAllCarteirasUseCase: FindAllCarteirasUseCase,
        private readonly findCarteiraByIdUseCase: FindCarteiraByIdUseCase,
        private readonly updateCarteiraUseCase: UpdateCarteiraUseCase,
        private readonly deleteCarteiraUseCase: DeleteCarteiraUseCase,
    ) {}

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar uma nova carteira', description: 'Cria uma nova carteira com os dados fornecidos' })
    @ApiResponse({ status: 201, description: 'Carteira criada com sucesso', type: CarteiraResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Body() createCarteiraDto: CreateCarteiraDto): Promise<CarteiraResponseDto> {
        const carteira = await this.createCarteiraUseCase.execute({nome: createCarteiraDto.nome, codigo: createCarteiraDto.codigo});
        return CarteiraResponseDto.fromEntity(carteira);
    }
    
    @Auth('MASTER', 'ADMIN', 'USER')
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todas as carteiras', description: 'Retorna uma lista paginada com todas as carteiras cadastradas' })
    @ApiOkResponse({
        description: 'Lista paginada de carteiras retornada com sucesso',
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerPaginatedDto(CarteiraResponseDto)) },
            ],
        },
    })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de registros por página' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        const carteiras = await this.findAllCarteirasUseCase.execute({ page, limit });
        return CarteiraResponseDto.fromEntities(carteiras);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar uma carteira', description: 'Retorna uma carteira com os dados fornecidos' })
    @ApiResponse({ status: 200, description: 'Carteira retornada com sucesso', type: CarteiraResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findOne(@Param('id') id: string): Promise<CarteiraResponseDto> {
        const carteira = await this.findCarteiraByIdUseCase.execute({id});
        return CarteiraResponseDto.fromEntity(carteira);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar uma carteira', description: 'Atualiza uma carteira com os dados fornecidos' })
    @ApiResponse({ status: 200, description: 'Carteira atualizada com sucesso', type: CarteiraResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async update(@Param('id') id: string, @Body() updateCarteiraDto: UpdateCarteiraDto): Promise<CarteiraResponseDto> {
        const carteira = await this.updateCarteiraUseCase.execute({id, nome: updateCarteiraDto.nome, codigo: updateCarteiraDto.codigo});
        return CarteiraResponseDto.fromEntity(carteira);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletar uma carteira', description: 'Deleta uma carteira com os dados fornecidos' })
    @ApiResponse({ status: 204, description: 'Carteira deletada com sucesso' })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteCarteiraUseCase.execute({id});
    }
}