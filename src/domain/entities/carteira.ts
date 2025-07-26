import { UnauthorizedException } from "@nestjs/common";
import { User, UserRole } from "./user";

type CarteiraProps = {
    id?: number;
    nome: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Carteira {
    private _id?: number;
    private _nome: string;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    

    constructor(props: CarteiraProps) {
        this._id = props.id;
        this._nome = props.nome;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    // Getters
    get id(): number | undefined {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    // Métodos de domínio
    update(updatedBy: User, nome: string): void {
        // Regra 1: Usuários USER não podem alterar carteiras
        if (updatedBy.userRole === UserRole.USER) {
        throw new UnauthorizedException('unauthorized.user.cannot.update.carteira');
        }
    
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
        this._nome = nome;
        }

        this._updatedAt = new Date();
    }
}