import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { IBnccService } from "../../../02-domain/interfaces/IBnccService";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { obterNomeAnoSerie } from "../../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../../02-domain/mappings/Disciplina_nome";
import { ano_serie } from "../../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../../02-domain/types/Disciplina_codigo";
import { DisciplinaDTO } from "../../dtos/DisciplinaDTOs/DisciplinaDTO";
import { DisciplinaResponseDTO } from "../../dtos/DisciplinaDTOs/DisciplinaResponseDTO";

export class CriarDisciplinaUseCase {
  /**
   * Caso de uso para criar uma nova disciplina
   * @param disciplinaRepository injeção do repositório de disciplinas
   */
  constructor(
    private disciplinaRepository: IDisciplinaRepository,
    private bnccService: IBnccService
  ) {}

  /**
   * Executa o caso de uso para criar uma nova disciplina
   * @param disciplinaDTO Dados da disciplina a ser criada
   * @returns Disciplina criada
   */
  async execute(disciplinaDTO: DisciplinaDTO): Promise<DisciplinaResponseDTO> {
    const codigoFormatado = disciplinaDTO.disciplina_codigo
      .trim()
      .toUpperCase() as disciplina_codigo;
    const anoSerieFormatado = disciplinaDTO.ano_serie
      .trim()
      .toUpperCase() as ano_serie;

    const disciplinaValida = this.bnccService.disciplinaValida(
      codigoFormatado,
      anoSerieFormatado
    );

    if (!disciplinaValida) {
      throw new Error(
        "Disciplina ou série inválida conforme o \"mapDisciplinaAnoSerie.json\"" +
          ` ${codigoFormatado} - ${anoSerieFormatado}` + " Verifique a documentação em /docs/API_DOCS.md"
      );
    }

    const disciplina = new Disciplina(
      "", //id gerado no banco
      codigoFormatado,
      anoSerieFormatado
    );

    const disciplinaCriada = await this.disciplinaRepository.criar(disciplina);

    return {
      id: disciplinaCriada.DisciplinaID,
      disciplinaCodigo: disciplinaCriada.disciplinaCodigo,
      nome: obterNomeDisciplina(disciplinaCriada.disciplinaCodigo),
      anoSerie: disciplinaCriada.anoSerie,
      anoSerieNome: obterNomeAnoSerie(disciplinaCriada.anoSerie),
    };
  }
}
