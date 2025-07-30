import { Carteira } from "src/domain/entities/carteira";

export abstract class ICarteiraRepository {
    abstract create(carteira: Carteira): Promise<Carteira>
    abstract findById(id: string): Promise<Carteira | null>
    abstract findByCodigo(codigo: string): Promise<Carteira | null>
    abstract findAll(): Promise<Carteira[]>
    abstract update(id: string, carteira: Carteira): Promise<Carteira | null>
    abstract delete(id: string): Promise<void>
}