import { error } from "node:console";
import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
import { DisciplinaResponseDTO } from "../../dtos/DisciplinaDTOs/DisciplinaResponseDTO";

export class ListarDisciplinaPorIDUseCase {
    constructor(private disciplinaRepository: IDisciplinaRepository) { }

    /**
     * 
     * @param id ID da disciplina a ser buscada
     * @returns Disciplina encontrada ou null se não existir
     */
    async execute(id: string): Promise<DisciplinaResponseDTO> {
        if (!id || id.trim() == "") {
            throw new Error("O ID da disciplina é obrigatório.");
        }

        const disciplina = await this.disciplinaRepository.findByID(id);

        if (!disciplina) {
            throw new Error("Disciplina não encontrada");
        }
        return {
            id: disciplina.DisciplinaID,
            disciplinaCodigo: disciplina.disciplinaCodigo,
            nome: obterNomeDisciplina(disciplina.disciplinaCodigo),
            anoSerie: disciplina.anoSerie,
            anoSerieNome: obterNomeAnoSerie(disciplina.anoSerie),

        }
    }
}