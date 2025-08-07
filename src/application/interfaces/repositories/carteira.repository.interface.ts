import { Carteira } from "src/domain/entities/carteira";
import { IPaginationOptions, IPaginatedResult } from '../common/pagination.interface';

export abstract class ICarteiraRepository {
    abstract create(carteira: Carteira): Promise<Carteira>
    abstract findById(id: string): Promise<Carteira | null>
    abstract findByCodigo(codigo: string): Promise<Carteira | null>
    abstract findAll(options?: IPaginationOptions): Promise<IPaginatedResult<Carteira>>
    abstract update(id: string, carteira: Carteira): Promise<Carteira | null>
    abstract delete(id: string): Promise<void>
}