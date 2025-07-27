import { Cedente } from 'src/domain/entities/cedente';
import { DocumentoFactory } from 'src/domain/value-objects/documento';
import { Cedente as CedenteTypeOrm } from '../entities/cedente.entity';

export class TypeOrmCedenteMapper {
    
    static toDomain(entity: CedenteTypeOrm): Cedente {
        if (!entity) return null;
        
        const documento = DocumentoFactory.create(entity.documento);
        
        const model = new Cedente({
            id: entity.id,
            nome: entity.nome,
            documento,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
        });
        return model;
    }

    static toTypeOrm(cedente: Cedente) {
        return {
            nome: cedente.nome,
            documento: cedente.documento.value,
            tipo_documento: cedente.documento.type,
        }
    }
}
