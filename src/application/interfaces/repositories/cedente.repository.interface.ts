import { Cedente } from "src/domain/entities/cedente";

export abstract class ICedenteRepository {
  abstract create(cedente: Cedente): Promise<Cedente>;
  abstract findById(id: number): Promise<Cedente | null>;
  abstract findByDocumento(documento: string): Promise<Cedente | null>;
  abstract findAll(): Promise<Cedente[]>;
  abstract update(id: number, cedente: Cedente): Promise<Cedente | null>;
}
