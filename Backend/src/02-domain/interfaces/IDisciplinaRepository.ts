import { Disciplina } from "../entities/Disciplina"

export interface IDisciplinaRepository {
    criar(disciplina: Disciplina): Promise<Disciplina>;
    listar(): Promise<Disciplina[]>;
    findByID(id: string): Promise<Disciplina | null>;
    excluir(id : string): Promise<void>;

}