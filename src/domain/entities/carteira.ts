export class Carteira {
    id?: number;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    

    constructor(props: Carteira) {
        Object.assign(this, props);
    }
}