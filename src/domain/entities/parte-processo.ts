import { Processo } from "./processo";

type ParteProcessoProps = {
    id?: string;
    processoId: string;
    cedenteId: string;
    valor: number;
    percentual: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export class ParteProcesso {
    private _id?: string;
    private _processoId: string;
    private _cedenteId: string;
    private _valor: number;
    private _percentual: number;
    private _createdAt?: Date;
    private _updatedAt?: Date;
    

    constructor(props: ParteProcessoProps) {
        this._id = props.id;
        this._processoId = props.processoId;
        this._cedenteId = props.cedenteId;
        this._valor = props.valor;
        this._percentual = props.percentual;
        this._createdAt = props.createdAt;
        this._updatedAt = props.updatedAt;
    }

    // Getters
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

    static create({processoId, cedenteId, percentual, processo, parteProcessoExists}: {processoId: string, cedenteId: string, percentual: number, processo: Processo, parteProcessoExists: ParteProcesso | null}): ParteProcesso {
        if (parteProcessoExists) {
            throw new Error('invalid.parteProcessoExists');
        }
        const parteProcesso = new ParteProcesso({
            processoId,
            cedenteId,
            percentual,
            valor: 0,
        });

        parteProcesso.calculateValor(processo.valorHomologado);

        return parteProcesso;
    }

    // Métodos de domínio
    update({ cedenteId, percentual, processo, parteProcessoExists }: { cedenteId?: string, percentual?: number, processo: Processo, parteProcessoExists: ParteProcesso | null }): void {
        if (parteProcessoExists && parteProcessoExists.id !== this.id) {
            throw new Error('invalid.parteProcessoExists');
        }
        if (cedenteId) {
            this._cedenteId = cedenteId;
        }
        if (percentual) {
            this._percentual = percentual;
        }

        this.calculateValor(processo.valorHomologado);

        this._updatedAt = new Date();
    }

    calculateValor(valorHomologado: number): void {
        this._valor = Math.round((this._percentual * valorHomologado) / 100);
    }

    canBeDeleted(): boolean {
        // TODO: Implementar lógica de exclusão
        // Deverá ser verificado se o processo possui algum registro (partes, documentos, etc) associado
        // Se houver, deve ser lançada uma exceção
        return true;
    }
}