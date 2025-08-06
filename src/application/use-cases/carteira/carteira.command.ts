export interface CreateCarteiraCommand {
    nome: string,
    codigo: string,
}

export interface DeleteCarteiraCommand {
    id: string,
}

export interface FindAllCarteirasCommand {
    page?: number;
    limit?: number;
}

export interface FindCarteiraByIdCommand {
    id: string;
}

export interface UpdateCarteiraCommand {
    id: string,
    nome: string,
    codigo: string,
}