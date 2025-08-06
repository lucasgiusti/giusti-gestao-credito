import { AuthenticatedUser } from "src/domain/entities/authenticated-user";
import { UserRole, UserStatus } from "src/domain/entities/user";

export interface CreateUserCommand {
    authenticatedUser: AuthenticatedUser,
    name: string,
}

export interface UpdateUserCommand {
    authenticatedUser: AuthenticatedUser,
    id: string,
    name?: string,
    userRole?: UserRole,
    status?: UserStatus,
}

export interface DeleteUserCommand {
    authenticatedUser: AuthenticatedUser,
    id: string,
}

export interface FindAllUsersCommand {
    page?: number;
    limit?: number;
}

export interface FindUserByIdCommand {
    id: string,
}