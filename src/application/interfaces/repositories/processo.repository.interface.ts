import { Processo } from "src/domain/entities/processo";
import { IPaginationOptions, IPaginatedResult } from "src/application/interfaces/common/pagination.interface";

export abstract class IProcessoRepository {
  abstract create(processo: Processo): Promise<Processo>;
  abstract findById(id: string): Promise<Processo | null>;
  abstract findByNumero(numero: string): Promise<Processo | null>;
  abstract findByCarteiraId(carteiraId: string, paginationOptions?: IPaginationOptions): Promise<IPaginatedResult<Processo>>;
  abstract existsByCarteiraId(carteiraId: string): Promise<boolean>;
  abstract findAll(paginationOptions: IPaginationOptions): Promise<IPaginatedResult<Processo>>;
  abstract update(id: string, processo: Processo): Promise<Processo | null>;
  abstract delete(id: string): Promise<void>;
}
