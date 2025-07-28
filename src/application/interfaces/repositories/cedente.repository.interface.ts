import { Cedente } from "src/domain/entities/cedente";

export abstract class ICedenteRepository {
  abstract create(cedente: Cedente): Promise<Cedente>;
  abstract findById(id: string): Promise<Cedente | null>;
  abstract findByDocumento(documento: string): Promise<Cedente | null>;
  abstract findAll(): Promise<Cedente[]>;
  abstract update(id: string, cedente: Cedente): Promise<Cedente | null>;
  abstract delete(id: string): Promise<void>;
}
