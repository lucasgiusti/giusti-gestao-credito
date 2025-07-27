import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCedenteUseCase } from 'src/application/use-cases/cedente/create-cedente.use-case';
import { CedenteResponseDto } from 'src/infraestructure/http/dtos/cedente/cedente-response.dto';
import { CreateCedenteDto } from 'src/infraestructure/http/dtos/cedente/create-cedente.dto';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';

@ApiTags('v1/cedentes')
@Controller('v1/cedentes')
export class CedenteController {

    constructor(
        private readonly createCedenteUseCase: CreateCedenteUseCase,
    ) {}

    @Auth('MASTER', 'ADMIN', 'USER')
    @Post()
    @ApiOperation({ summary: 'Criar um novo cedente', description: 'Cria um novo cedente com os dados fornecidos' })
    @ApiResponse({ status: 201, description: 'Cedente criado com sucesso', type: CedenteResponseDto })
    @ApiResponse({ status: 400, description: 'Requisição inválida' })
    @ApiResponse({ status: 401, description: 'Não autorizado' })
    async create(@Body() createCedenteDto: CreateCedenteDto): Promise<CedenteResponseDto> {
        const cedente = await this.createCedenteUseCase.execute({nome: createCedenteDto.nome, documento: createCedenteDto.documento});
        return CedenteResponseDto.fromEntity(cedente);
    }
}