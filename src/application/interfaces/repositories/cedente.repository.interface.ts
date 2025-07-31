import { Cedente } from "src/domain/entities/cedente";
import { PaginationOptions, PaginatedResult } from '../common/pagination.interface';

export abstract class ICedenteRepository {
  abstract create(cedente: Cedente): Promise<Cedente>;
  abstract findById(id: string): Promise<Cedente | null>;
  abstract findByDocumento(documento: string): Promise<Cedente | null>;
  abstract findAll(options?: PaginationOptions): Promise<PaginatedResult<Cedente>>;
  abstract update(id: string, cedente: Cedente): Promise<Cedente | null>;
  abstract delete(id: string): Promise<void>;
}
