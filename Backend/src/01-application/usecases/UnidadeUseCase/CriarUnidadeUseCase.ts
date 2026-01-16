import { Unidade } from "../../../02-domain/entities/Unidade";
import { IBnccService } from "../../../02-domain/interfaces/IBnccService";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { origem_tema } from "../../../02-domain/types/Origem_Tema";
import { UnidadeDTO } from "../../dtos/UnidadeDTO";

export class CriarUnidadeUseCase {
  /**
   * Caso de uso para criar uma nova unidade
   * @param unidadeRepository injeção do repositório de unidades
   */
  constructor(private unidadeRepository: IUnidadeRepository, private bnccService: IBnccService) {}
    /**
     * 
     * @param unidadeDTO Dados da unidade a ser criada
     * @returns Unidade criada
     */
  async execute(unidadeDTO: UnidadeDTO) {
    const temaFormatado = unidadeDTO.tema.trim().toLocaleUpperCase();
    const origemTemaFormatado = unidadeDTO.origem_tema.trim().toLocaleUpperCase() as origem_tema;

    if (origemTemaFormatado == "BNCC") {
        const temaValido = await this.bnccService.validarTemaBncc(temaFormatado);
        if (!temaValido) {
            throw new Error("Tema inválido conforme a BNCC: " + temaFormatado);
        }        
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
