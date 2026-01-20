import { Unidade } from "../../../02-domain/entities/Unidade";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { UnidadeDTO } from "../../dtos/UnidadeDTO";

export class CriarUnidadeUseCase {
  /**
   * Caso de uso para criar uma nova unidade
   * @param unidadeRepository injeção do repositório de unidades
   * @param disciplinaRepository injeção do repositório de disciplinas
   */
  constructor(
    private unidadeRepository: IUnidadeRepository,
    private disciplinaRepository: IDisciplinaRepository
  ) {}
  /**
   *
   * @param unidadeDTO Dados da unidade a ser criada
   * @returns Unidade criada
   */
  async execute(unidadeDTO: UnidadeDTO) : Promise<Unidade> {
    const temaFormatado = unidadeDTO.tema.trim().toLocaleUpperCase();

    const disciplina = await this.disciplinaRepository.findByID(unidadeDTO.disciplina_id);

    if (!disciplina) {
      throw new Error("Disciplina não encontrada");
    }

    const unidade = new Unidade(
      "", //id gerado no banco
      unidadeDTO.disciplina_id,
      temaFormatado,
      null //data de criação gerada no banco
    );
    return this.unidadeRepository.criar(unidade);
  }
}
