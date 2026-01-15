import { Disciplina } from "../../02-domain/entities/Disciplina";
import { IBnccService } from "../../02-domain/interfaces/IBnccService";
import { IDisciplinaRepository } from "../../02-domain/interfaces/IDisciplinaRepository";
import { ano_serie } from "../../02-domain/types/Ano_Serie";
import { disciplina_codigo } from "../../02-domain/types/Discplina_codigo";
import { DisciplinaDTO } from "../dtos/DisciplinaDTO";

export class CriarDisciplinaUseCase {
  /**
   * Caso de uso para criar uma nova disciplina
   * @param disciplinaRepository injeção do repositório de disciplinas
   */
  constructor(private disciplinaRepository: IDisciplinaRepository, private bnccService: IBnccService) {}

  /**
   * @param disciplinaDTO Dados da disciplina a ser criada
   * @returns Disciplina criada
   */
  async execute(disciplinaDTO: DisciplinaDTO) {

    const codigoFormatado =  disciplinaDTO.disciplina_codigo.trim().toUpperCase() as disciplina_codigo;
    const anoSerieFormatado = disciplinaDTO.ano_serie.trim().toUpperCase() as ano_serie;
    
    const disciplinaValida = this.bnccService.disciplinaValida(codigoFormatado, anoSerieFormatado);

    if (!disciplinaValida) {
      throw new Error("Disciplina ou série inválida conforme a BNCC"+ `  ${codigoFormatado} - ${anoSerieFormatado}`);
    }

    const disciplina = new Disciplina(
      "", //id gerado no banco
      codigoFormatado,
      anoSerieFormatado
    );
    return await this.disciplinaRepository.criar(disciplina);
  }
}
