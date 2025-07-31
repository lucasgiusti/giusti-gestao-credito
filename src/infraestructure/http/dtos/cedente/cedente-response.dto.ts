import { ApiProperty } from '@nestjs/swagger';
import { Cedente } from 'src/domain/entities/cedente';
import { DocumentoTipo } from 'src/domain/value-objects/documento';
import { PaginatedResultDto } from '../common/paginated-result.dto';
import { PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export class CedenteResponseDto {
  @ApiProperty({ description: 'ID do cedente' })
  id: string;

  @ApiProperty({ description: 'Nome do cedente' })
  nome: string;

  @ApiProperty({ description: 'Documento do cedente (sem formatação)' })
  documento: string;

  @ApiProperty({ description: 'Documento do cedente (formatado)', example: '123.456.789-00' })
  documentoFormatado: string;

  @ApiProperty({ description: 'Tipo do documento', enum: DocumentoTipo, example: 'CPF' })
  tipoDocumento: DocumentoTipo;

  @ApiProperty({ description: 'Data de criação do registro' })
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do registro' })
  updatedAt: Date;

  constructor(cedente: Cedente) {
    this.id = cedente.id;
    this.nome = cedente.nome;
    this.documento = cedente.documento.value;
    this.documentoFormatado = cedente.documento.format();
    this.tipoDocumento = cedente.documento.type;
    this.createdAt = cedente.createdAt;
    this.updatedAt = cedente.updatedAt;
  }

  static fromEntity(cedente: Cedente): CedenteResponseDto {
    return new CedenteResponseDto(cedente);
  }

  static fromEntities(cedentes: Cedente[] | PaginatedResult<Cedente>): CedenteResponseDto[] | PaginatedResultDto<CedenteResponseDto> {
    if (Array.isArray(cedentes)) {
      return cedentes.map(cedente => CedenteResponseDto.fromEntity(cedente));
    } else {
      // É um resultado paginado
      return PaginatedResultDto.fromPaginatedResult(cedentes, (cedente) => CedenteResponseDto.fromEntity(cedente));
    }
  }
}
