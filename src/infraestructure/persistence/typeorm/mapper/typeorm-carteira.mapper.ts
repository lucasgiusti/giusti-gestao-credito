import { Carteira } from 'src/domain/entities/carteira';
import { Carteira as CarteiraTypeOrm } from '../entities/carteira.entity';

export class TypeOrmCarteiraMapper {
    
    static toDomain(entity: CarteiraTypeOrm): Carteira {
        if (!entity) return null;
        
        const model = new Carteira({
            id: entity.id,
            nome: entity.nome,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        });
        return model;
    }

    static toTypeOrm(carteira: Carteira) {
        return {
            nome: carteira.nome,
            created_at: carteira.createdAt,
            updated_at: carteira.updatedAt,
        }
    }
}