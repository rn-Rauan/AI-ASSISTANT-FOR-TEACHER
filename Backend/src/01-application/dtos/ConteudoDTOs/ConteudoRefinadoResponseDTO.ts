import { ConteudoGeradoResponseDTO } from "./ConteudoGeradoResponseDTO";

export type ResponseRefinamento = {
  conteudo: string;
  mensagemIA: string;
};

export interface ConteudoRefinadoResponseDTO
  extends ConteudoGeradoResponseDTO {
  mensagemIA: string;
}