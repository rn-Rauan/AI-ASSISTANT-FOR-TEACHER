import { ConteudoGeradoResponseDTO } from "../ConteudoDTOs/ConteudoGeradoResponseDTO";

/**
 * DTO de resposta para criação de unidade com conteúdos
 * @unidade Dados da unidade criada
 * @conteudos Array de conteúdos gerados
 */
export interface CriarUnidadeComConteudosResponseDTO {
  unidade: {
    id: string;
    disciplinaID: string;
    tema: string;
    criadoEm: Date;
  };
  conteudos: ConteudoGeradoResponseDTO[];
}
