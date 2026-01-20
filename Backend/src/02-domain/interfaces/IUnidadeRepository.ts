import { Unidade } from "../entities/Unidade";

export interface IUnidadeRepository {
    criar(unidade: Unidade): Promise<Unidade>;
    listar(disciplina_id?: string): Promise<Unidade[]>;
    findByID(id: string): Promise<Unidade | null>;
    excluir(id : string): Promise<void>;
}