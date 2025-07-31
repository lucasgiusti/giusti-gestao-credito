import { ParteProcesso } from "src/domain/entities/parte-processo";
import { PaginatedResult, PaginationOptions } from "src/application/interfaces/common/pagination.interface";

export abstract class IParteProcessoRepository {
  abstract create(parteProcesso: ParteProcesso): Promise<ParteProcesso>;
  abstract findById(id: string): Promise<ParteProcesso | null>;
  abstract findByProcessoId(processoId: string, paginationOptions?: PaginationOptions): Promise<PaginatedResult<ParteProcesso>>;
  abstract existsByProcessoId(processoId: string): Promise<boolean>;
  abstract existsByCedenteId(cedenteId: string): Promise<boolean>;
  abstract findByProcessoIdAndCedenteId(processoId: string, cedenteId: string): Promise<ParteProcesso | null>;
  abstract findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<ParteProcesso>>;
  abstract update(id: string, parteProcesso: ParteProcesso): Promise<ParteProcesso | null>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByProcessoId(processoId: string): Promise<void>;
}
