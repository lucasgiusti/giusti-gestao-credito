import { Processo } from "src/domain/entities/processo";
import { PaginationOptions, PaginatedResult } from "src/application/interfaces/common/pagination.interface";

export abstract class IProcessoRepository {
  abstract create(processo: Processo): Promise<Processo>;
  abstract findById(id: string): Promise<Processo | null>;
  abstract findByNumero(numero: string): Promise<Processo | null>;
  abstract findByCarteiraId(carteiraId: string, paginationOptions?: PaginationOptions): Promise<PaginatedResult<Processo>>;
  abstract existsByCarteiraId(carteiraId: string): Promise<boolean>;
  abstract findAll(paginationOptions: PaginationOptions): Promise<PaginatedResult<Processo>>;
  abstract update(id: string, processo: Processo): Promise<Processo | null>;
  abstract delete(id: string): Promise<void>;
}
