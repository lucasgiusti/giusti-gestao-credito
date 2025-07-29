import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateParteProcessoDto } from '../dtos/parte-processo/create-parte-processo.dto';
import { ParteProcessoResponseDto } from '../dtos/parte-processo/parte-processo-response.dto';
import { UpdateParteProcessoDto } from '../dtos/parte-processo/update-parte-processo.dto';
import { CreateParteProcessoUseCase } from 'src/application/use-cases/parte-processo/create-parte-processo.use-case';
import { FindParteProcessoByIdUseCase } from 'src/application/use-cases/parte-processo/find-parte-processo-by-id.use-case';
import { FindPartesByProcessoIdUseCase } from 'src/application/use-cases/parte-processo/find-partes-by-processo-id.use-case';
import { UpdateParteProcessoUseCase } from 'src/application/use-cases/parte-processo/update-parte-processo.use-case';
import { DeleteParteProcessoUseCase } from 'src/application/use-cases/parte-processo/delete-parte-processo.use-case';

@ApiTags('v1/partes-processo')
@Controller('v1/partes-processo')
export class ParteProcessoController {
    constructor(
        private readonly createParteProcessoUseCase: CreateParteProcessoUseCase,
        private readonly findParteProcessoByIdUseCase: FindParteProcessoByIdUseCase,
        private readonly findPartesByProcessoIdUseCase: FindPartesByProcessoIdUseCase,
        private readonly updateParteProcessoUseCase: UpdateParteProcessoUseCase,
        private readonly deleteParteProcessoUseCase: DeleteParteProcessoUseCase
    ) {}

    @Post()
    @ApiOperation({ summary: 'Criar uma nova parte de processo' })
    @ApiResponse({ status: 201, description: 'Parte de processo criada com sucesso', type: ParteProcessoResponseDto })
    async create(@Body() createParteProcessoDto: CreateParteProcessoDto): Promise<ParteProcessoResponseDto> {
        const parteProcesso = await this.createParteProcessoUseCase.execute({
            processoId: createParteProcessoDto.processoId,
            cedenteId: createParteProcessoDto.cedenteId,
            valor: createParteProcessoDto.valor,
            percentual: createParteProcessoDto.percentual
        });

        return ParteProcessoResponseDto.fromEntity(parteProcesso);
    }

    @Get('processo/:processoId')
    @ApiOperation({ summary: 'Listar todas as partes de um processo' })
    @ApiResponse({ status: 200, description: 'Lista de partes do processo', type: [ParteProcessoResponseDto] })
    async findByProcessoId(@Param('processoId') processoId: string): Promise<ParteProcessoResponseDto[]> {
        const partesProcesso = await this.findPartesByProcessoIdUseCase.execute(processoId);

        return ParteProcessoResponseDto.fromEntities(partesProcesso);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Buscar uma parte de processo pelo ID' })
    @ApiResponse({ status: 200, description: 'Parte de processo encontrada', type: ParteProcessoResponseDto })
    async findById(@Param('id') id: string): Promise<ParteProcessoResponseDto> {
        const parteProcesso = await this.findParteProcessoByIdUseCase.execute(id);

        return ParteProcessoResponseDto.fromEntity(parteProcesso);
    }

    @Put(':id')
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

    @Delete(':id')
    @ApiOperation({ summary: 'Excluir uma parte de processo' })
    @ApiResponse({ status: 204, description: 'Parte de processo excluída' })
    async delete(@Param('id') id: string): Promise<void> {
        await this.deleteParteProcessoUseCase.execute(id);
    }
}
