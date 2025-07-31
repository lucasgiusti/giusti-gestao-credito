import { Body, Controller, Post, Get, Delete, Put, Query, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiExtraModels, ApiOkResponse, getSchemaPath, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SwaggerPaginatedDto } from '../dtos/common/swagger-paginated.dto';
import { CreateCedenteUseCase } from 'src/application/use-cases/cedente/create-cedente.use-case';
import { CedenteResponseDto } from 'src/infraestructure/http/dtos/cedente/cedente-response.dto';
import { CreateCedenteDto } from 'src/infraestructure/http/dtos/cedente/create-cedente.dto';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { FindAllCedentesUseCase } from 'src/application/use-cases/cedente/find-all-cedentes.use-case';
import { FindCedenteByIdUseCase } from 'src/application/use-cases/cedente/find-cedente-by-id.use-case';
import { DeleteCedenteUseCase } from 'src/application/use-cases/cedente/delete-cedente.use-case';
import { UpdateCedenteDto } from '../dtos/cedente/update-cedente.dto';
import { UpdateCedenteUseCase } from 'src/application/use-cases/cedente/update-cedente.use-case';
import { FindCedenteByDocumentoUseCase } from 'src/application/use-cases/cedente/find-cedente-by-documento.use-case';

@ApiTags('v1/cedentes')
@ApiExtraModels(SwaggerPaginatedDto(CedenteResponseDto))
@Controller('v1/cedentes')
export class CedenteController {

    constructor(
        private readonly createCedenteUseCase: CreateCedenteUseCase,
        private readonly findAllCedentesUseCase: FindAllCedentesUseCase,
        private readonly findByIdCedenteUseCase: FindCedenteByIdUseCase,
        private readonly deleteCedenteUseCase: DeleteCedenteUseCase,
        private readonly updateCedenteUseCase: UpdateCedenteUseCase,
        private readonly findByDocumentoCedenteUseCase: FindCedenteByDocumentoUseCase,
    ) {}

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar um novo cedente', description: 'Cria um novo cedente com os dados fornecidos' })
    @ApiResponse({ status: 201, description: 'Cedente criado com sucesso', type: CedenteResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Body() createCedenteDto: CreateCedenteDto): Promise<CedenteResponseDto> {
        const cedente = await this.createCedenteUseCase.execute({nome: createCedenteDto.nome, documento: createCedenteDto.documento});
        return CedenteResponseDto.fromEntity(cedente);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todos os cedentes', description: 'Lista todos os cedentes' })
    @ApiOkResponse({
        description: 'Lista paginada de cedentes',
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerPaginatedDto(CedenteResponseDto)) },
            ],
        },
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de registros por página' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findAll(@Query('page') page?: number,
            @Query('limit') limit?: number) {
        const cedentes = await this.findAllCedentesUseCase.execute({ page, limit });
        return CedenteResponseDto.fromEntities(cedentes);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar cedente por ID', description: 'Busca um cedente por seu ID' })
    @ApiResponse({ status: 200, description: 'Cedente encontrado com sucesso', type: CedenteResponseDto })
    @ApiResponse({ status: 404, description: 'Cedente não encontrado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findById(@Param('id') id: string): Promise<CedenteResponseDto> {
        const cedente = await this.findByIdCedenteUseCase.execute({id});
        return CedenteResponseDto.fromEntity(cedente);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get('/documento/:documento')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar cedente por documento', description: 'Busca um cedente por seu documento' })
    @ApiResponse({ status: 200, description: 'Cedente encontrado com sucesso', type: CedenteResponseDto })
    @ApiResponse({ status: 404, description: 'Cedente não encontrado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async findByDocumento(@Param('documento') documento: string): Promise<CedenteResponseDto> {
        const cedente = await this.findByDocumentoCedenteUseCase.execute({documento});
        return CedenteResponseDto.fromEntity(cedente);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar cedente por ID', description: 'Atualiza um cedente por seu ID' })
    @ApiResponse({ status: 200, description: 'Cedente atualizado com sucesso', type: CedenteResponseDto })
    @ApiResponse({ status: 404, description: 'Cedente não encontrado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async update(@Param('id') id: string, @Body() updateCedenteDto: UpdateCedenteDto): Promise<CedenteResponseDto> {
        const cedente = await this.updateCedenteUseCase.execute({id, ...updateCedenteDto});
        return CedenteResponseDto.fromEntity(cedente);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Deletar cedente por ID', description: 'Deleta um cedente por seu ID' })
    @ApiResponse({ status: 204, description: 'Cedente deletado com sucesso' })
    @ApiResponse({ status: 404, description: 'Cedente não encontrado' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteCedenteUseCase.execute({id});
    }
}