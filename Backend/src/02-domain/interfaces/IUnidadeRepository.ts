import { Unidade } from "../entities/Unidade";

export interface IUnidadeRepository {
    criar(unidade: Unidade): Promise<Unidade>;
    listar(): Promise<Unidade[]>;
    findByID(id: string): Promise<Unidade | null>;
    excluir(id : string): Promise<void>;
}