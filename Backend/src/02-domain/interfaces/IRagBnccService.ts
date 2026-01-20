import { ConsultarRAG } from "../../01-application/dtos/RagDTOs/ConsultarRagDTO";

/**
 * Interface simples para o serviço de RAG
 */
export interface IRagBnccService {
  /**
   * Consulta a API de RAG e retorna o contexto da BNCC
   */
  consultarBNCC(consulta: ConsultarRAG): Promise<string>;
}
