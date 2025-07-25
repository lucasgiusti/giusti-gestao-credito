export class Carteira {
    id?: number;
    nome: string;
    createdAt?: Date;
    updatedAt?: Date;
    

    constructor(props: Carteira) {
        Object.assign(this, props);
    }
}