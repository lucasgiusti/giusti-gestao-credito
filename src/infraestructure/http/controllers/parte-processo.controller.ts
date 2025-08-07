import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiExtraModels, ApiOkResponse, getSchemaPath, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SwaggerPaginatedDto } from '../dtos/common/swagger-paginated.dto';
import { ParteProcessoResponseDto } from '../dtos/parte-processo/parte-processo-response.dto';
import { FindAllPartesProcessoUseCase } from 'src/application/use-cases/parte-processo/find-all-partes-processo.use-case';
import { Auth } from 'src/infraestructure/decorators/auth.decorator';

@ApiTags('v1/partes-processo')
@ApiExtraModels(SwaggerPaginatedDto(ParteProcessoResponseDto))
@Controller('v1/partes-processo')
export class ParteProcessoController {
    constructor(
        private readonly findAllPartesProcessoUseCase: FindAllPartesProcessoUseCase,
    ) {}

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
}