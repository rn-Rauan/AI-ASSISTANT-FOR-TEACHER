import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
import { DisciplinaResponseDTO } from "../../dtos/DisciplinaDTOs/DisciplinaResponseDTO";

export class ListarDisciplinaUseCase {

  /**
   * Caso de uso para listar todas as disciplinas
   * @param disciplinaRepository injeção do repositório de disciplinas
   */
  constructor(private disciplinaRepository: IDisciplinaRepository) {}

  /**
   * Executa o caso de uso para listar todas as disciplinas
   * @returns Lista de disciplinas
   */
  async execute(): Promise<DisciplinaResponseDTO[]> {
    const disciplinas = await this.disciplinaRepository.listar();
    const diciplinasComNomes = disciplinas.map((disciplina) => ({
      id: disciplina.DisciplinaID,
      disciplinaCodigo: disciplina.disciplinaCodigo,
      nome: obterNomeDisciplina(disciplina.disciplinaCodigo),
      anoSerie: disciplina.anoSerie,
      anoSerieNome: obterNomeAnoSerie(disciplina.anoSerie),
    }));
    return diciplinasComNomes;
  }
}
