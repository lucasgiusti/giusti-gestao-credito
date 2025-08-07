import { Documento, DocumentoFactory } from '../value-objects/documento';

type CedenteProps = {
    id?: string;
    nome: string;
    documento: Documento | string;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Cedente {
    private _id?: string;
    private _nome: string;
    private _documento: Documento;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    
    constructor(props: CedenteProps) {
        this._id = props.id;
        this._nome = props.nome;
        this._documento = Cedente.createDocumento(props.documento);
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    get id(): string | undefined {
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

    static create({nome, documento}: CedenteProps): Cedente {

        const documentoObj = Cedente.createDocumento(documento);
            
        return new Cedente({
            nome,
            documento: documentoObj,
        });
    }

    update({nome, documento}: CedenteProps): Cedente {
        this.updateNome(nome);
        this.updateDocumento(documento);

        return this;
    }

    updateNome(nome: string): void {
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
            this._nome = nome;
            this._updatedAt = new Date();
        }
    }

    updateDocumento(documento: string | Documento): void {
        if (documento !== undefined && documento !== null) {
            this._documento = Cedente.createDocumento(documento);
            this._updatedAt = new Date();
        }
    }

    static createDocumento(documento: string | Documento): Documento {
        if (typeof documento === 'string') {
            return DocumentoFactory.create(documento);
        }
        return documento;
    }
}