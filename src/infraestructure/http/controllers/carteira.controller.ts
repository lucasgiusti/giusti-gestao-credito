import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateCarteiraDto } from 'src/infraestructure/http/dtos/carteira/create-carteira.dto';
import { CreateCarteiraUseCase } from 'src/application/use-cases/carteira/create-carteira.use-case';
import { Carteira } from 'src/domain/entities/carteira';
import { FindAllCarteirasUseCase } from 'src/application/use-cases/carteira/find-all-carteiras.use-case';

@ApiTags('v1/carteiras')
@Controller('v1/carteiras')
export class CarteiraController {

    constructor(
        private readonly createCarteiraUseCase: CreateCarteiraUseCase,
        private readonly findAllCarteirasUseCase: FindAllCarteirasUseCase,
    ) {}

    @Post()
    async create(@Body() createCarteiraDto: CreateCarteiraDto): Promise<Carteira> {
        const response = await this.createCarteiraUseCase.execute(createCarteiraDto);
        return response;
    }
    
    @Get()
    async findAll(): Promise<Carteira[]> {
        const response = await this.findAllCarteirasUseCase.execute({});
        return response;
    }
}