import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiResponse, ApiTags, ApiExtraModels, ApiOkResponse, getSchemaPath, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SwaggerPaginatedDto } from '../dtos/common/swagger-paginated.dto';
import { CreateProcessoDto } from '../dtos/processo/create-processo.dto';
import { ProcessoResponseDto } from '../dtos/processo/processo-response.dto';
import { UpdateProcessoDto } from '../dtos/processo/update-processo.dto';
import { CreateProcessoUseCase } from 'src/application/use-cases/processo/create-processo.use-case';
import { FindAllProcessosUseCase } from 'src/application/use-cases/processo/find-all-processos.use-case';
import { FindProcessoByIdUseCase } from 'src/application/use-cases/processo/find-processo-by-id.use-case';
import { UpdateProcessoUseCase } from 'src/application/use-cases/processo/update-processo.use-case';
import { DeleteProcessoUseCase } from 'src/application/use-cases/processo/delete-processo.use-case';
import { ImportProcessoCsvUseCase } from 'src/application/use-cases/processo/import-processo-csv.use-case';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';
import { ImportProcessoCsvResponseDto } from '../dtos/processo/import-processo-csv-response.dto';

@ApiTags('v1/processos')
@ApiExtraModels(SwaggerPaginatedDto(ProcessoResponseDto))
@Controller('v1/processos')
export class ProcessoController {
    constructor(
        private readonly createProcessoUseCase: CreateProcessoUseCase,
        private readonly findAllProcessosUseCase: FindAllProcessosUseCase,
        private readonly findProcessoByIdUseCase: FindProcessoByIdUseCase,
        private readonly updateProcessoUseCase: UpdateProcessoUseCase,
        private readonly deleteProcessoUseCase: DeleteProcessoUseCase,
        private readonly importProcessoCsvUseCase: ImportProcessoCsvUseCase
    ) {}

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Criar um novo processo' })
    @ApiResponse({ status: 201, description: 'Processo criado com sucesso', type: ProcessoResponseDto })
    async create(@Body() createProcessoDto: CreateProcessoDto): Promise<ProcessoResponseDto> {
        const processo = await this.createProcessoUseCase.execute({
            numero: createProcessoDto.numero,
            carteiraId: createProcessoDto.carteiraId,
            valorPedido: createProcessoDto.valorPedido,
            valorHomologado: createProcessoDto.valorHomologado,
            tipo: createProcessoDto.tipo,
        });

        return ProcessoResponseDto.fromEntity(processo);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get()
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Listar todos os processos' })
    @ApiOkResponse({
        description: 'Lista paginada de processos',
        schema: {
            allOf: [
                { $ref: getSchemaPath(SwaggerPaginatedDto(ProcessoResponseDto)) },
            ],
        },
    })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Quantidade de registros por página' })
    async findAll(@Query('page') page?: number,
            @Query('limit') limit?: number) {
        const processos = await this.findAllProcessosUseCase.execute({ page, limit });
        return ProcessoResponseDto.fromEntities(processos);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Get(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Buscar um processo pelo ID' })
    @ApiResponse({ status: 200, description: 'Processo encontrado', type: ProcessoResponseDto })
    async findById(@Param('id') id: string): Promise<ProcessoResponseDto> {
        const processo = await this.findProcessoByIdUseCase.execute({ id });

        return ProcessoResponseDto.fromEntity(processo);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Put(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Atualizar um processo' })
    @ApiResponse({ status: 200, description: 'Processo atualizado', type: ProcessoResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateProcessoDto: UpdateProcessoDto
    ): Promise<ProcessoResponseDto> {
        const processo = await this.updateProcessoUseCase.execute({
            id,
            numero: updateProcessoDto.numero,
            carteiraId: updateProcessoDto.carteiraId,
            valorPedido: updateProcessoDto.valorPedido,
            valorHomologado: updateProcessoDto.valorHomologado,
            tipo: updateProcessoDto.tipo
        });

        return ProcessoResponseDto.fromEntity(processo);
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Excluir um processo' })
    @ApiResponse({ status: 204, description: 'Processo excluído' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteProcessoUseCase.execute({ id });
    }

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post('import/csv')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Importar processos a partir de um arquivo CSV' })
    @ApiConsumes('multipart/form-data')
    @ApiResponse({ status: 200, description: 'Dados do CSV processados', type: ImportProcessoCsvResponseDto })
    @UseInterceptors(FileInterceptor('file'))
    async importCsv(@UploadedFile() file: Express.Multer.File): Promise<ImportProcessoCsvResponseDto> {
        const processoCsvEntities = await this.importProcessoCsvUseCase.execute({
            buffer: file.buffer
        });
        
        const processadosDTO = processoCsvEntities;
        
        const resultado = {
            processados: processadosDTO,
            totalRegistros: processadosDTO.length,
            dataProcessamento: new Date()
        };
        
        return ImportProcessoCsvResponseDto.fromData(resultado);
    }
}