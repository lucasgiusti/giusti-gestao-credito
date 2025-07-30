import { ParteProcesso } from "./parte-processo";

export enum TipoProcesso {
    PRECATORIO = 'PRECATORIO',
    JUDICIAL = 'JUDICIAL',
    NPL = 'NPL',
}

type ProcessoProps = {
    id?: string;
    numero: string;
    carteiraId: string;
    valorPedido: number;
    valorHomologado: number;
    tipo: TipoProcesso;
    partes: ParteProcesso[];
    createdAt?: Date;
    updatedAt?: Date;
}
export class Processo {
    private _id?: string;
    private _numero: string;
    private _carteiraId: string;
    private _valorPedido: number;
    private _valorHomologado: number;
    private _tipo: TipoProcesso;
    private _partes: ParteProcesso[];
    private _createdAt?: Date;
    private _updatedAt?: Date;
    

    constructor(props: ProcessoProps) {
        this._id = props.id;
        this._numero = props.numero;
        this._carteiraId = props.carteiraId;
        this._valorPedido = props.valorPedido;
        this._valorHomologado = props.valorHomologado;
        this._tipo = props.tipo;
        this._partes = props.partes;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    // Getters
    get id(): string | undefined {
        return this._id;
    }

    get numero(): string {
        return this._numero;
    }

    get carteiraId(): string {
        return this._carteiraId;
    }

    get valorPedido(): number {
        return this._valorPedido;
    }

    get valorHomologado(): number {
        return this._valorHomologado;
    }

    get tipo(): TipoProcesso {
        return this._tipo;
    }

    get partes(): ParteProcesso[] {
        return this._partes;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    static create({numero, carteiraId, valorPedido, valorHomologado, tipo, processoExists}: {numero: string, carteiraId: string, valorPedido: number, valorHomologado: number, tipo: TipoProcesso, processoExists?: Processo | null}): Processo {
        if (processoExists) {
            throw new Error('invalid.processo.numero.exists');
        }
        return new Processo({
            numero,
            carteiraId,
            valorPedido,
            valorHomologado,
            tipo,
            partes: [],
        });
    }

    addParteProcesso(parteProcesso: ParteProcesso): void {
        this._partes.push(parteProcesso);
    }

    updateParteProcesso(parteProcesso: ParteProcesso): void {
        this._partes.find((parte) => parte.id === parteProcesso.id).update({
            cedenteId: parteProcesso.cedenteId,
            percentual: parteProcesso.percentual,
            parteProcessoExists: parteProcesso
        });
    }
    
    // Métodos de domínio
    update({ numero, carteiraId, valorPedido, valorHomologado, tipo, processoExists }: { numero?: string, carteiraId?: string, valorPedido?: number, valorHomologado?: number, tipo?: TipoProcesso, processoExists?: Processo | null }): void {
        if (processoExists && processoExists.id !== this.id) {
            throw new Error('invalid.processo.numero.exists');
        }

        if (numero !== undefined && numero !== null && numero.trim() !== '') {
            this._numero = numero;
        }

        if (carteiraId) {
            this._carteiraId = carteiraId;
        }

        if (valorPedido) {
            this._valorPedido = valorPedido;
        }

        if (valorHomologado) {
            this._valorHomologado = valorHomologado;
        }

        if (tipo) {
            this._tipo = tipo;
        }

        this._updatedAt = new Date();
    }

    canBeDeleted(existsPartes: boolean): boolean {
        if (existsPartes) {
            throw new Error('invalid.processo.exists.partes');
        }
        return true;
    }

    validatePartes(): boolean {
        const somaPercentuais = this.partes.reduce((acc, parte) => acc + parte.percentual, 0);
        
        if (somaPercentuais > 100) {
            throw new Error('invalid.processo.partes.percentual');
        }
        return true;
    }
}