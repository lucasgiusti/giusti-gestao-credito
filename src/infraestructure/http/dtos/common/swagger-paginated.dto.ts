import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResultDto } from './paginated-result.dto';

export function SwaggerPaginatedDto<T>(classRef: Type<T>): any {
  class PaginatedDtoClass extends PaginatedResultDto<T> {
    @ApiProperty({
      type: [classRef],
      description: 'Dados paginados'
    })
    data: T[];
  }

  // Definir o nome da classe para o Swagger
  Object.defineProperty(PaginatedDtoClass, 'name', {
    value: `Paginated${classRef.name}Dto`,
    writable: false
  });

  return PaginatedDtoClass;
}
