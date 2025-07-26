import { User } from 'src/domain/entities/user';
import { User as UserTypeOrm } from '../entities/user.entity';

export class TypeOrmUserMapper {
    
    static toDomain(entity: UserTypeOrm): User {
        if (!entity) return null;
        
        const model = new User({
            id: entity.id,
            name: entity.name,
            email: entity.email,
            userRole: entity.user_role,
            status: entity.status,
            authServiceUserId: entity.auth_service_user_id,
            createdAt: entity.created_at,
            updatedAt: entity.updated_at,
            deletedAt: entity.deleted_at,
        });
        return model;
    }

    static toTypeOrm(user: User) {
        return {
            name: user.name,
            email: user.email,
            user_role: user.userRole,
            status: user.status,
            auth_service_user_id: user.authServiceUserId,
            deleted_at: user.deletedAt,
        }
    }
}