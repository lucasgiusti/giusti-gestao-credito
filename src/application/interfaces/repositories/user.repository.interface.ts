import { User } from "src/domain/entities/user";
import { PaginationOptions, PaginatedResult } from '../common/pagination.interface';

export abstract class IUserRepository {
    abstract create(user: User): Promise<User>
    abstract findById(id: string): Promise<User | null>
    abstract findByEmail(email: string): Promise<User | null>
    abstract findByAuthServiceUserId(authServiceUserId: string): Promise<User | null>
    abstract findAll(options?: PaginationOptions): Promise<PaginatedResult<User>>
    abstract update(id: string, user: User): Promise<User | null>
}