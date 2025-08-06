import { UnauthorizedException } from "@nestjs/common";
import { User, UserRole } from "./user";
import { CreateCarteiraCommand, UpdateCarteiraCommand } from "src/application/use-cases/carteira/carteira.command";

type CarteiraProps = {
    id?: string;
    nome: string;
    codigo: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export class Carteira {
    private _id?: string;
    private _nome: string;
    private _codigo: string;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    

    constructor(props: CarteiraProps) {
        this._id = props.id;
        this._nome = props.nome;
        this._codigo = props.codigo;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    get id(): string | undefined {
        return this._id;
    }

    get nome(): string {
        return this._nome;
    }

    get codigo(): string {
        return this._codigo;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    static create(command: CreateCarteiraCommand): Carteira {
        return new Carteira({
            nome: command.nome,
            codigo: command.codigo,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    update(command: UpdateCarteiraCommand): void {
        this.updateNome(command.nome);
        this.updateCodigo(command.codigo);
    }

    updateNome(nome: string): void {
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
            this._nome = nome;
            this._updatedAt = new Date();
        }
    }

    updateCodigo(codigo: string): void {
        if (codigo !== undefined && codigo !== null && codigo.trim() !== '') {
            this._codigo = codigo;
            this._updatedAt = new Date();
        }
    }
}