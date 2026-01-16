import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";

export class ListarDisciplinaPorIDUseCase {
    constructor(private disciplinaRepository: IDisciplinaRepository) {}

    /**
     * 
     * @param id ID da disciplina a ser buscada
     * @returns Disciplina encontrada ou null se não existir
     */
    async execute(id: string): Promise<Disciplina | null> {
        if (!id || id.trim() == "") {
            throw new Error("O ID da disciplina é obrigatório.");
        }
        const disciplina = await this.disciplinaRepository.findByID(id);
        return disciplina;
    }
}