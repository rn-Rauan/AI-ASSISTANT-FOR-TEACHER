import { origem_tema } from "../../02-domain/types/Origem_Tema";

export interface UnidadeResponseDTO {
  id: string;
  disciplinaID: string;
  tema: string;
  origem: origem_tema;
  criadoEm: Date;
}