import { UnauthorizedException } from "@nestjs/common";
import { User, UserRole } from "./user";

type CarteiraProps = {
    id?: string;
    nome: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Carteira {
    private _id?: string;
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
    get id(): string | undefined {
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
    update({ nome }: { nome: string }): void {
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
        this._nome = nome;
        }

        this._updatedAt = new Date();
    }

    canBeDeleted(): boolean {
        // TODO: Implementar lógica de exclusão
        // Deverá ser verificado se a carteira possui algum processo associado
        // Se houver, deve ser lançada uma exceção
        return true;
    }
}