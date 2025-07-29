import { ParteProcesso } from "src/domain/entities/parte-processo";

export abstract class IParteProcessoRepository {
  abstract create(parteProcesso: ParteProcesso): Promise<ParteProcesso>;
  abstract findById(id: string): Promise<ParteProcesso | null>;
  abstract findByProcessoId(processoId: string): Promise<ParteProcesso[]>;
  abstract findByCedenteId(cedenteId: string): Promise<ParteProcesso[]>;
  abstract findByProcessoIdAndCedenteId(processoId: string, cedenteId: string): Promise<ParteProcesso | null>;
  abstract findAll(): Promise<ParteProcesso[]>;
  abstract update(id: string, parteProcesso: ParteProcesso): Promise<ParteProcesso | null>;
  abstract delete(id: string): Promise<void>;
  abstract deleteByProcessoId(processoId: string): Promise<void>;
}
