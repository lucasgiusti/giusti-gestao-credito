import type { Cedente } from "./cedente";
import { Processo } from "./processo";

export type ParteProcessoProps = {
    id?: string;
    processoId: string;
    cedenteId: string;
    valor?: number;
    percentual: number;
    createdAt?: Date;
    updatedAt?: Date;
    cedente?: Cedente;
    processo?: Processo;
}
export class ParteProcesso {
    private _id?: string;
    private _processoId: string;
    private _cedenteId: string;
    private _valor?: number;
    private _percentual: number;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    private _cedente?: Cedente;
    private _processo?: Processo;
    

    constructor(props: ParteProcessoProps) {
        this._id = props.id;
        this._processoId = props.processoId;
        this._cedenteId = props.cedenteId;
        this._valor = props.valor;
        this._percentual = props.percentual;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
        this._cedente = props.cedente;
        this._processo = props.processo;
    }

    get id(): string | undefined {
        return this._id;
    }

    get processoId(): string {
        return this._processoId;
    }

    get cedenteId(): string {
        return this._cedenteId;
    }

    get valor(): number {
        return this._valor;
    }

    get percentual(): number {
        return this._percentual;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    get cedente(): Cedente | undefined {
        return this._cedente;
    }

    get processo(): Processo | undefined {
        return this._processo;
    }

    static create({processoId, cedenteId, percentual}: ParteProcessoProps, valorHomologado: number): ParteProcesso {
        const parteProcesso = new ParteProcesso({
            processoId,
            cedenteId,
            percentual
        });

        parteProcesso.calculateValor(valorHomologado);

        return parteProcesso;
    }

    update({cedenteId, percentual}: ParteProcessoProps, valorHomologado: number): ParteProcesso {
        this.updateCedenteId(cedenteId);
        this.updatePercentual(percentual);
        this.calculateValor(valorHomologado);
        return this;
    }

    updateCedenteId(cedenteId: string): void {
        this._cedenteId = cedenteId;
        this._updatedAt = new Date();
    }

    updatePercentual(percentual: number): void {
        this._percentual = percentual;
        this._updatedAt = new Date();
    }

    calculateValor(valorHomologado: number): void {
        this._valor = Math.round((this._percentual * valorHomologado) / 100);
    }
}