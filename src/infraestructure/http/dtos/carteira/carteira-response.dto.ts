import { ApiProperty } from '@nestjs/swagger';
import { IPaginatedResult } from 'src/application/interfaces/common/pagination.interface';
import { Carteira } from 'src/domain/entities/carteira';
import { PaginatedResultDto } from '../common/paginated-result.dto';

export class CarteiraResponseDto {
  @ApiProperty({ description: 'ID da carteira' })
  id: string;

  @ApiProperty({ description: 'Nome da carteira' })
  nome: string;

  @ApiProperty({ description: 'Código da carteira' })
  codigo: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(carteira: Carteira) {
    this.id = carteira.id;
    this.nome = carteira.nome;
    this.codigo = carteira.codigo;
    this.createdAt = carteira.createdAt;
    this.updatedAt = carteira.updatedAt;
  }

  static fromEntity(carteira: Carteira): CarteiraResponseDto {
    return new CarteiraResponseDto(carteira);
  }

  static fromEntities(carteiras: Carteira[] | IPaginatedResult<Carteira>): CarteiraResponseDto[] | PaginatedResultDto<CarteiraResponseDto> {
    if (Array.isArray(carteiras)) {
      return carteiras.map(carteira => CarteiraResponseDto.fromEntity(carteira));
    } else {
      // É um resultado paginado
      return PaginatedResultDto.fromPaginatedResult(carteiras, (carteira) => CarteiraResponseDto.fromEntity(carteira));
    }
  }
}
