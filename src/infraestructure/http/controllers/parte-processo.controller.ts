import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiExtraModels, ApiOkResponse, getSchemaPath, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SwaggerPaginatedDto } from '../dtos/common/swagger-paginated.dto';
import { CreateParteProcessoDto } from '../dtos/parte-processo/create-parte-processo.dto';
import { ParteProcessoResponseDto } from '../dtos/parte-processo/parte-processo-response.dto';
import { UpdateParteProcessoDto } from '../dtos/parte-processo/update-parte-processo.dto';
import { CreateParteProcessoUseCase } from 'src/application/use-cases/parte-processo/create-parte-processo.use-case';
import { FindParteProcessoByIdUseCase } from 'src/application/use-cases/parte-processo/find-parte-processo-by-id.use-case';
import { FindPartesByProcessoIdUseCase } from 'src/application/use-cases/parte-processo/find-partes-by-processo-id.use-case';
import { FindAllPartesProcessoUseCase } from 'src/application/use-cases/parte-processo/find-all-partes-processo.use-case';
import { UpdateParteProcessoUseCase } from 'src/application/use-cases/parte-processo/update-parte-processo.use-case';
import { DeleteParteProcessoUseCase } from 'src/application/use-cases/parte-processo/delete-parte-processo.use-case';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';

@ApiTags('v1/partes-processo')
@ApiExtraModels(SwaggerPaginatedDto(ParteProcessoResponseDto))
@Controller('v1/partes-processo')
export class ParteProcessoController {
    constructor(
        private readonly createParteProcessoUseCase: CreateParteProcessoUseCase,
        private readonly findParteProcessoByIdUseCase: FindParteProcessoByIdUseCase,
        private readonly findPartesByProcessoIdUseCase: FindPartesByProcessoIdUseCase,
        private readonly findAllPartesProcessoUseCase: FindAllPartesProcessoUseCase,
        private readonly updateParteProcessoUseCase: UpdateParteProcessoUseCase,
        private readonly deleteParteProcessoUseCase: DeleteParteProcessoUseCase
    ) {}

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar uma nova parte de processo' })
    @ApiResponse({ status: 201, description: 'Parte de processo criada com sucesso', type: ParteProcessoResponseDto })
    async create(@Body() createParteProcessoDto: CreateParteProcessoDto): Promise<ParteProcessoResponseDto> {
        const parteProcesso = await this.createParteProcessoUseCase.execute({
            processoId: createParteProcessoDto.processoId,
            cedenteId: createParteProcessoDto.cedenteId,
            percentual: createParteProcessoDto.percentual
        });

        return ParteProcessoResponseDto.fromEntity(parteProcesso);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get('processo/:processoId')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todas as partes de um processo' })
    @ApiOkResponse({
        description: 'Lista paginada de partes do processo',
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerPaginatedDto(ParteProcessoResponseDto)) },
            ],
        },
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de registros por página' })
    async findByProcessoId(
        @Param('processoId') processoId: string,
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        const partesProcesso = await this.findPartesByProcessoIdUseCase.execute({ processoId, page, limit });

        return ParteProcessoResponseDto.fromEntities(partesProcesso);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todas as partes de processo' })
    @ApiOkResponse({
        description: 'Lista paginada de partes de processo',
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerPaginatedDto(ParteProcessoResponseDto)) },
            ],
        },
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de registros por página' })
    async findAll(
        @Query('page') page?: number,
        @Query('limit') limit?: number
    ) {
        const partesProcesso = await this.findAllPartesProcessoUseCase.execute({ page, limit });

        return ParteProcessoResponseDto.fromEntities(partesProcesso);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar uma parte de processo pelo ID' })
    @ApiResponse({ status: 200, description: 'Parte de processo encontrada', type: ParteProcessoResponseDto })
    async findById(@Param('id') id: string): Promise<ParteProcessoResponseDto> {
        const parteProcesso = await this.findParteProcessoByIdUseCase.execute({ id });

        return ParteProcessoResponseDto.fromEntity(parteProcesso);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar uma parte de processo' })
    @ApiResponse({ status: 200, description: 'Parte de processo atualizada', type: ParteProcessoResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateParteProcessoDto: UpdateParteProcessoDto
    ): Promise<ParteProcessoResponseDto> {
        const parteProcesso = await this.updateParteProcessoUseCase.execute({
            id,
            cedenteId: updateParteProcessoDto.cedenteId,
            percentual: updateParteProcessoDto.percentual
        });

        return ParteProcessoResponseDto.fromEntity(parteProcesso);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir uma parte de processo' })
    @ApiResponse({ status: 204, description: 'Parte de processo excluída' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteParteProcessoUseCase.execute({ id });
    }
}