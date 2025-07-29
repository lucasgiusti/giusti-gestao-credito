import { Processo } from "src/domain/entities/processo";

export abstract class IProcessoRepository {
  abstract create(processo: Processo): Promise<Processo>;
  abstract findById(id: string): Promise<Processo | null>;
  abstract findByNumero(numero: string): Promise<Processo | null>;
  abstract findByCarteiraId(carteiraId: string): Promise<Processo[]>;
  abstract findAll(): Promise<Processo[]>;
  abstract update(id: string, processo: Processo): Promise<Processo | null>;
  abstract delete(id: string): Promise<void>;
}
