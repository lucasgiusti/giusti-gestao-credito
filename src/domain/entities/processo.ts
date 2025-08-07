import { ParteProcesso, ParteProcessoProps } from "./parte-processo";

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
    partes?: ParteProcesso[];
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
    private _partes?: ParteProcesso[];
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

    static create({numero, carteiraId, valorPedido, valorHomologado, tipo}: ProcessoProps): Processo {
        return new Processo({
            numero,
            carteiraId,
            valorPedido,
            valorHomologado,
            tipo,
        });
    }

    addParteProcesso({processoId, cedenteId, percentual}: ParteProcessoProps): ParteProcesso {
        const parteProcessoCreated = ParteProcesso.create({processoId, cedenteId, percentual}, this.valorHomologado)
        this._partes.push(parteProcessoCreated);

        return parteProcessoCreated;
    }

    updateParteProcesso({id, cedenteId, percentual}: ParteProcessoProps): ParteProcesso {
        const parteProcessoUpdated = this._partes.find((parte) => parte.id === id).update({processoId: this.id, cedenteId, percentual}, this.valorHomologado);
        return parteProcessoUpdated;
    }

    deleteParteProcesso(id: string): ParteProcesso {
        const parteProcessoRemoved = this._partes.find((parte) => parte.id === id);
        this._partes = this._partes.filter((parte) => parte.id !== id);
        return parteProcessoRemoved;
    }
    
    update({numero, carteiraId, valorPedido, valorHomologado, tipo}: ProcessoProps): Processo {
        this.updateNumero(numero);
        this.updateCarteiraId(carteiraId);
        this.updateValorPedido(valorPedido);
        this.updateValorHomologado(valorHomologado);
        this.updateTipo(tipo);

        return this;
    }

    updateNumero(numero: string): void {
        if (numero !== undefined && numero !== null && numero.trim() !== '') {
            this._numero = numero;
            this._updatedAt = new Date();
        }
    }

    updateCarteiraId(carteiraId: string): void {
        if (carteiraId) {
            this._carteiraId = carteiraId;
            this._updatedAt = new Date();
        }
    }

    updateValorPedido(valorPedido: number): void {
        if (valorPedido) {
            this._valorPedido = valorPedido;
            this._updatedAt = new Date();
        }
    }

    updateValorHomologado(valorHomologado: number): void {
        if (valorHomologado) {
            this._valorHomologado = valorHomologado;
            this._updatedAt = new Date();
        }
    }

    updateTipo(tipo: TipoProcesso): void {
        if (tipo) {
            this._tipo = tipo;
            this._updatedAt = new Date();
        }
    }
}