import { User } from "src/domain/entities/user";

export abstract class IUserRepository {
    abstract create(user: User): Promise<User>
    abstract findById(id: number): Promise<User | null>
    abstract findByEmail(email: string): Promise<User | null>
    abstract findAll(): Promise<User[]>
    abstract delete(id: number): Promise<void>
    abstract update(id: number, user: User): Promise<User>
}