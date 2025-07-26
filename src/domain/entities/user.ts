import { UnauthorizedException } from "@nestjs/common";

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export enum UserRole {
    MASTER = 'MASTER',
    ADMIN = 'ADMIN',
    USER = 'USER'
}

type UserProps = {
    id?: number;
    name: string;
    email: string;
    userRole?: UserRole;
    status?: UserStatus;
    authServiceUserId: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}

export class User {
    private _id?: number;
    private _name: string;
    private _email: string;
    private _userRole: UserRole;
    private _status: UserStatus;
    private _authServiceUserId: string;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    private _deletedAt?: Date;

    constructor(props: UserProps) {
        this._id = props.id;
        this._name = props.name;
        this._email = props.email;
        this._userRole = props.userRole || UserRole.USER;
        this._status = props.status || UserStatus.INACTIVE;
        this._authServiceUserId = props.authServiceUserId;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._deletedAt = props.deletedAt;
    }

    // Getters
    get id(): number | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get userRole(): UserRole {
        return this._userRole;
    }

    get status(): UserStatus {
        return this._status;
    }

    get authServiceUserId(): string {
        return this._authServiceUserId;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    get deletedAt(): Date | undefined {
        return this._deletedAt;
    }

    // Métodos de domínio
    activate(): void {
        this._status = UserStatus.ACTIVE;
    }

    deactivate(): void {
        this._status = UserStatus.INACTIVE;
    }

    changeRole(role: UserRole): void {
        this._userRole = role;
    }

    isActive(): boolean {
        return this._status === UserStatus.ACTIVE;
    }

    isAdmin(): boolean {
        return this._userRole === UserRole.ADMIN;
    }

    isMaster(): boolean {
        return this._userRole === UserRole.MASTER;
    }

    // Factory method para criar um novo usuário a partir de um usuário autenticado
    static createFromAuthUser(name: string, email: string, authServiceUserId: string): User {
        return new User({
            name,
            email,
            authServiceUserId,
        });
    }

    updateData(updatedBy: User, name?: string, status?: UserStatus, userRole?: UserRole): void {
        // Regra 1: Usuários USER não podem alterar usuários
        if (updatedBy.userRole === UserRole.USER) {
          throw new UnauthorizedException('unauthorized.user.cannot.update.user');
        }
      
        // Regra 2: Usuários MASTER não podem ter seu userRole e status alterados
        if (this.isMaster() && ((status !== undefined && status !== UserStatus.ACTIVE) || (userRole !== undefined && userRole !== UserRole.MASTER))) {
          throw new UnauthorizedException('unauthorized.master.cannot.update.user.role.or.status');
        }

        if (userRole !== undefined && this.id === updatedBy.id && updatedBy.userRole !== userRole) {
          throw new UnauthorizedException('unauthorized.user.cannot.update.yourself.role');
        }

        if (status !== undefined && this.id === updatedBy.id && updatedBy.status !== status) {
          throw new UnauthorizedException('unauthorized.user.cannot.update.yourself.status');
        }
      
        if (name !== undefined && name !== null && name.trim() !== '') {
          this._name = name;
        }
      
        if (status !== undefined && !this.isMaster()) {
          this._status = status;
        }
      
        if (userRole !== undefined && !this.isMaster()) {
          this._userRole = userRole;
        }
      }

      delete(updatedBy: User): void {
        if (updatedBy.userRole === UserRole.USER) {
          throw new UnauthorizedException('unauthorized.user.cannot.delete.user');
        }

        if (this.id === updatedBy.id) {
          throw new UnauthorizedException('unauthorized.user.cannot.delete.yourself');
        }

        if (this.isMaster()) {
          throw new UnauthorizedException('unauthorized.master.cannot.delete.user');
        }

        this._deletedAt = new Date();
      }
}