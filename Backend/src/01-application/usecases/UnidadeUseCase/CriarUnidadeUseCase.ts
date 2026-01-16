import { Unidade } from "../../../02-domain/entities/Unidade";
import { IBnccService } from "../../../02-domain/interfaces/IBnccService";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { origem_tema } from "../../../02-domain/types/Origem_Tema";
import { UnidadeDTO } from "../../dtos/UnidadeDTO";

export class CriarUnidadeUseCase {
  /**
   * Caso de uso para criar uma nova unidade
   * @param unidadeRepository injeção do repositório de unidades
   * @param disciplinaRepository injeção do repositório de disciplinas
   * @param bnccService injeção do serviço de validação de tema BNCC
   */
  constructor(
    private unidadeRepository: IUnidadeRepository,
    private disciplinaRepository: IDisciplinaRepository,
    private bnccService: IBnccService
  ) {}
  /**
   *
   * @param unidadeDTO Dados da unidade a ser criada
   * @returns Unidade criada
   */
  async execute(unidadeDTO: UnidadeDTO) {
    const temaFormatado = unidadeDTO.tema.trim().toLocaleUpperCase();
    const origemTemaFormatado = unidadeDTO.origem_tema
      .trim()
      .toLocaleUpperCase() as origem_tema;

    if (origemTemaFormatado == "BNCC") {
      const temaValido = await this.bnccService.validarTemaBncc(temaFormatado);
      if (!temaValido) {
        throw new Error("Tema inválido conforme a BNCC: " + temaFormatado);
      }
    }

    if (!await this.disciplinaRepository.findByID(unidadeDTO.disciplina_id)) {
      throw new Error("Disciplina não encontrada");
    }

    const unidade = new Unidade(
      "", //id gerado no banco
      unidadeDTO.disciplina_id,
      temaFormatado,
      origemTemaFormatado
    );
    return this.unidadeRepository.criar(unidade);
  }
}
