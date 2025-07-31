import { Carteira } from "src/domain/entities/carteira";
import { PaginationOptions, PaginatedResult } from '../common/pagination.interface';

export abstract class ICarteiraRepository {
    abstract create(carteira: Carteira): Promise<Carteira>
    abstract findById(id: string): Promise<Carteira | null>
    abstract findByCodigo(codigo: string): Promise<Carteira | null>
    abstract findAll(options?: PaginationOptions): Promise<PaginatedResult<Carteira>>
    abstract update(id: string, carteira: Carteira): Promise<Carteira | null>
    abstract delete(id: string): Promise<void>
}