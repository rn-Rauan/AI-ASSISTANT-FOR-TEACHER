import { IConteudoGeradoRepository } from "../../../02-domain/interfaces/IConteudoGeradoRepository";
import { ConteudoGeradoResponseDTO } from "../../dtos/ConteudoDTOs/ConteudoGeradoResponseDTO";

/**
 * UseCase para listar conteúdos de uma unidade
 */
export class ListarConteudosUseCase {
  /**
   * 
   * @param conteudoGeradoRepository Repositório para acesso aos conteúdos gerados
   */
  constructor(private conteudoGeradoRepository: IConteudoGeradoRepository) {}
  /**
   * 
   * @param unidade_id ID da unidade cujos conteúdos serão listados
   * @returns Lista de conteúdos gerados para a unidade
   */
  async execute(unidade_id: string): Promise<ConteudoGeradoResponseDTO[]> {
    const conteudos = await this.conteudoGeradoRepository.listarPorUnidade(unidade_id);

    return conteudos.map((conteudo) => ({
      id: conteudo.ConteudoID,
      unidadeID: conteudo.UnidadeID,
      tipo: conteudo.Tipo,
      conteudo: conteudo.Conteudo,
      criadoEm: conteudo.CriadoEm,
    }));
  }
}
