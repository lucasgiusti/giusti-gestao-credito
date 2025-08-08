import { Processo, TipoProcesso } from 'src/domain/entities/processo';
import { Processo as ProcessoTypeOrm } from '../entities/processo.entity';
import { TypeOrmParteProcessoMapper } from './typeorm-parte-processo.mapper';

export class TypeOrmProcessoMapper {
    
    static toDomain(entity: ProcessoTypeOrm): Processo {
        if (!entity) return null;
        
        const model = new Processo({
            id: entity.id,
            numero: entity.numero,
            carteiraId: entity.carteira_id,
            valorPedido: entity.valor_pedido,
            valorHomologado: entity.valor_homologado,
            tipo: entity.tipo as TipoProcesso,
            partes: entity.partes && entity.partes.length > 0 ? entity.partes.map(parte => TypeOrmParteProcessoMapper.toDomain(parte)) : [],
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        });

        return model;
    }

    static toTypeOrm(processo: Processo) {
        return {
            numero: processo.numero,
            carteira_id: processo.carteiraId,
            valor_pedido: processo.valorPedido,
            valor_homologado: processo.valorHomologado,
            tipo: processo.tipo,
        }
    }
}
