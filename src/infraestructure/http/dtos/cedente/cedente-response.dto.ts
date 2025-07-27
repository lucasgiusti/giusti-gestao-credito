import { ApiProperty } from '@nestjs/swagger';
import { Cedente } from 'src/domain/entities/cedente';
import { Documento } from 'src/domain/value-objects/documento';

export class CedenteResponseDto {
  @ApiProperty({ description: 'ID do cedente' })
  id: number;

  @ApiProperty({ description: 'Nome do cedente' })
  nome: string;

  @ApiProperty({ description: 'Documento do cedente' })
  documento: Documento;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(cedente: Cedente) {
    this.id = cedente.id;
    this.nome = cedente.nome;
    this.documento = cedente.documento;
    this.createdAt = cedente.createdAt;
    this.updatedAt = cedente.updatedAt;
  }

  static fromEntity(cedente: Cedente): CedenteResponseDto {
    return new CedenteResponseDto(cedente);
  }

  static fromEntities(cedentes: Cedente[]): CedenteResponseDto[] {
    return cedentes.map(cedente => CedenteResponseDto.fromEntity(cedente));
  }
}
