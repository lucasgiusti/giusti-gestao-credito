import { ApiProperty } from '@nestjs/swagger';
import type { ProcessoCsv } from 'src/domain/entities/processo-csv';

export class ImportProcessoCsvResponseDto {
  @ApiProperty({ description: 'Número de registros processados' })
  totalRegistros: number;

  @ApiProperty({ description: 'Data e hora do processamento' })
  dataProcessamento: Date;

  @ApiProperty({ description: 'Dados lidos do arquivo CSV' })
  processados: ProcessoCsv[];

  static fromData(result: { processados: ProcessoCsv[], totalRegistros: number, dataProcessamento: Date }): ImportProcessoCsvResponseDto {
    return {
      totalRegistros: result.totalRegistros,
      dataProcessamento: result.dataProcessamento,
      processados: result.processados,
    };
  }
}

// Usando a entidade de domínio ProcessoCsv como tipo, não precisamos mais desta interface
// export interface ProcessoCsvRecord {...}
// A entidade ProcessoCsv já fornece a tipagem necessária
