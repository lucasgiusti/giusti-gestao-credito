import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProcessoDto } from '../dtos/processo/create-processo.dto';
import { ProcessoResponseDto } from '../dtos/processo/processo-response.dto';
import { UpdateProcessoDto } from '../dtos/processo/update-processo.dto';
import { CreateProcessoUseCase } from 'src/application/use-cases/processo/create-processo.use-case';
import { FindAllProcessosUseCase } from 'src/application/use-cases/processo/find-all-processos.use-case';
import { FindProcessoByIdUseCase } from 'src/application/use-cases/processo/find-processo-by-id.use-case';
import { UpdateProcessoUseCase } from 'src/application/use-cases/processo/update-processo.use-case';
import { DeleteProcessoUseCase } from 'src/application/use-cases/processo/delete-processo.use-case';

@ApiTags('v1/processos')
@Controller('v1/processos')
export class ProcessoController {
    constructor(
        private readonly createProcessoUseCase: CreateProcessoUseCase,
        private readonly findAllProcessosUseCase: FindAllProcessosUseCase,
        private readonly findProcessoByIdUseCase: FindProcessoByIdUseCase,
        private readonly updateProcessoUseCase: UpdateProcessoUseCase,
        private readonly deleteProcessoUseCase: DeleteProcessoUseCase
    ) {}

    @Post()
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

    @Get()
    @ApiOperation({ summary: 'Listar todos os processos' })
    @ApiResponse({ status: 200, description: 'Lista de processos', type: [ProcessoResponseDto] })
    async findAll(): Promise<ProcessoResponseDto[]> {
        const processos = await this.findAllProcessosUseCase.execute();
        return ProcessoResponseDto.fromEntities(processos);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar um processo pelo ID' })
    @ApiResponse({ status: 200, description: 'Processo encontrado', type: ProcessoResponseDto })
    async findById(@Param('id') id: string): Promise<ProcessoResponseDto> {
        const processo = await this.findProcessoByIdUseCase.execute(id);

        return ProcessoResponseDto.fromEntity(processo);
    }

    @Put(':id')
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

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir um processo' })
    @ApiResponse({ status: 204, description: 'Processo excluído' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteProcessoUseCase.execute(id);
    }
}
