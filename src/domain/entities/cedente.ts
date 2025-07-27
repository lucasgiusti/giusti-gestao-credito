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
    update({ nome, documento, cedenteExists }: { nome?: string, documento?: string | Documento, cedenteExists?: Cedente | null }): void {
        if (cedenteExists && cedenteExists.id !== this.id) {
            throw new Error('invalid.cedente.documento.exists');
        }
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

    canBeDeleted(): boolean {
        // TODO: Implementar lógica de exclusão
        // Deverá ser verificado se o cedente possui algum processo associado
        // Se houver, deve ser lançada uma exceção
        return true;
    }

    // Factory method para criar um novo cedente
    static create({nome, documento, cedenteExists}: {nome: string, documento: string | Documento, cedenteExists?: Cedente | null}): Cedente {

        if (cedenteExists) {
            throw new Error('invalid.cedente.documento.exists');
        }
        const documentoObj = typeof documento === 'string' 
            ? DocumentoFactory.create(documento) 
            : documento;
            
        return new Cedente({
            nome,
            documento: documentoObj,
        });
    }
}