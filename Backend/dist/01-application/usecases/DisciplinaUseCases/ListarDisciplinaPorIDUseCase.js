import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
export class ListarDisciplinaPorIDUseCase {
    constructor(disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }
    /**
     *
     * @param id ID da disciplina a ser buscada
     * @returns Disciplina encontrada ou null se não existir
     */
    async execute(id) {
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
        };
    }
}
