import { ApiProperty } from '@nestjs/swagger';
import { Carteira } from 'src/domain/entities/carteira';

export class CarteiraResponseDto {
  @ApiProperty({ description: 'ID da carteira' })
  id: string;

  @ApiProperty({ description: 'Nome da carteira' })
  nome: string;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(carteira: Carteira) {
    this.id = carteira.id;
    this.nome = carteira.nome;
    this.createdAt = carteira.createdAt;
    this.updatedAt = carteira.updatedAt;
  }

  static fromEntity(carteira: Carteira): CarteiraResponseDto {
    return new CarteiraResponseDto(carteira);
  }

  static fromEntities(carteiras: Carteira[]): CarteiraResponseDto[] {
    return carteiras.map(carteira => CarteiraResponseDto.fromEntity(carteira));
  }
}
