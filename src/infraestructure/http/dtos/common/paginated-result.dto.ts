import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResult } from 'src/application/interfaces/common/pagination.interface';

export class PaginatedResultDto<T> {
  @ApiProperty({ description: 'Dados paginados' })
  data: T[];

  @ApiProperty({ description: 'Total de registros' })
  total: number;

  @ApiProperty({ description: 'Página atual' })
  page: number;

  @ApiProperty({ description: 'Limite de registros por página' })
  limit: number;

  @ApiProperty({ description: 'Total de páginas' })
  totalPages: number;

  constructor(paginatedResult: PaginatedResult<any>, mapFn?: (item: any) => T) {
    this.data = mapFn ? paginatedResult.data.map(mapFn) : paginatedResult.data;
    this.total = paginatedResult.total;
    this.page = paginatedResult.page;
    this.limit = paginatedResult.limit;
    this.totalPages = paginatedResult.totalPages;
  }

  static fromPaginatedResult<T, U>(
    paginatedResult: PaginatedResult<T>,
    mapFn: (item: T) => U
  ): PaginatedResultDto<U> {
    return new PaginatedResultDto<U>(paginatedResult, mapFn);
  }
}
