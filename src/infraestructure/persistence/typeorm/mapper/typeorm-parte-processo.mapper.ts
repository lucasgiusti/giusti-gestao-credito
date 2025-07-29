import { ParteProcesso } from 'src/domain/entities/parte-processo';
import { ParteProcesso as ParteProcessoTypeOrm } from '../entities/parte-processo.entity';

export class TypeOrmParteProcessoMapper {
    
    static toDomain(entity: ParteProcessoTypeOrm): ParteProcesso {
        if (!entity) return null;
        
        const model = new ParteProcesso({
            id: entity.id,
            processoId: entity.processo_id,
            cedenteId: entity.cedente_id,
            valor: typeof entity.valor === 'string' ? parseFloat(entity.valor) : entity.valor,
            percentual: typeof entity.percentual === 'string' ? parseFloat(entity.percentual) : entity.percentual,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        });
        return model;
    }

    static toTypeOrm(parteProcesso: ParteProcesso) {
        return {
            processo_id: parteProcesso.processoId,
            cedente_id: parteProcesso.cedenteId,
            valor: parteProcesso.valor,
            percentual: parteProcesso.percentual,
        }
    }
}
