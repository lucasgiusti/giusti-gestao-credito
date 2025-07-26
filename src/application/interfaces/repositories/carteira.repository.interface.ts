import { Carteira } from "src/domain/entities/carteira";

export abstract class ICarteiraRepository {
    abstract create(carteira: Carteira): Promise<Carteira>
    abstract findById(id: number): Promise<Carteira | null>
    abstract findAll(): Promise<Carteira[]>
    abstract update(id: number, carteira: Carteira): Promise<Carteira | null>
}