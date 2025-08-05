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
    id?: string;
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
    private _id?: string;
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

    get id(): string | undefined {
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

    activate(): void {
        this.updateStatus(UserStatus.ACTIVE);
    }

    deactivate(): void {
        this.updateStatus(UserStatus.INACTIVE);
    }

    changeRole(role: UserRole): void {
        this.updateUserRole(role);
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

    static createFromAuthUser({ name, email, authServiceUserId }: { name: string, email: string, authServiceUserId: string }): User {
        return new User({
            name,
            email,
            authServiceUserId,
        });
    }

    update({ name, status, userRole }: { name?: string, status?: UserStatus, userRole?: UserRole }): void {
      this.updateName(name);
      this.updateStatus(status);
      this.updateUserRole(userRole);
    }

    updateName(name: string): void {
        if (name !== undefined && name !== null && name.trim() !== '') {
            this._name = name;
            this._updatedAt = new Date();
        }
    }

    updateStatus(status: UserStatus): void {
        if (status !== undefined && !this.isMaster()) {
            this._status = status;
            this._updatedAt = new Date();
        }
    }

    updateUserRole(userRole: UserRole): void {
        if (userRole !== undefined && !this.isMaster()) {
            this._userRole = userRole;
            this._updatedAt = new Date();
        }
    }

    delete(): void {
      this._deletedAt = new Date();
    }
}