import { Documento, DocumentoFactory } from '../value-objects/documento';

type CedenteProps = {
    id?: number;
    nome: string;
    documento: Documento;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Cedente {
    private _id?: number;
    private _nome: string;
    private _documento: Documento;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    
    constructor(props: CedenteProps) {
        this._id = props.id;
        this._nome = props.nome;
        this._documento = props.documento;
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

    get documento(): Documento {
        return this._documento;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    // Métodos de domínio
    update({ nome, documento }: { nome?: string, documento?: string | Documento }): void {
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
            this._nome = nome;
        }

        if (documento !== undefined && documento !== null) {
            if (typeof documento === 'string') {
                this._documento = DocumentoFactory.create(documento);
            } else {
                this._documento = documento;
            }
        }

        this._updatedAt = new Date();
    }

    // Factory method para criar um novo cedente
    static create({nome, documento}: {nome: string, documento: string | Documento}): Cedente {
        const documentoObj = typeof documento === 'string' 
            ? DocumentoFactory.create(documento) 
            : documento;
            
        return new Cedente({
            nome,
            documento: documentoObj,
        });
    }
}