import axios, { AxiosError } from "axios";
import { IRagBnccService } from "../../02-domain/interfaces/IRagBnccService";
import { ConsultarRagDTO } from "../../01-application/dtos/RagDTOs/ConsultarRagDTO";
import { obterNomeAnoSerie } from "../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../02-domain/mappings/Disciplina_nome";
import { RagApiResponseDTO } from "../../01-application/dtos/RagDTOs/RagApiResponseDTO";

/**
 * Serviço simples para consultar a API de RAG
 */
export class RagBnccService implements IRagBnccService {
  private apiUrl: string;
  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async consultarBNCC(consulta: ConsultarRagDTO): Promise<string> {
    const consultaFormatada = {
      tema: consulta.tema,
      disciplina: obterNomeDisciplina(consulta.disciplina_codigo),
      serie: obterNomeAnoSerie(consulta.ano_serie),
    };

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 120000); // 120 segundos

    try {
      const response = await axios.post<RagApiResponseDTO>(
        `${this.apiUrl}/api/gerar-contexto`,
        consultaFormatada,
        { signal: abortController.signal },
      );

      clearTimeout(timeout);

      const data = response.data;
      // Retorna o contexto já formatado
      const contexto = data.contexto;

      const habilidades = contexto.habilidadesBNCC.map(
        (hab) => `- [${hab.codigo}] ${hab.descricao}`,
      );

      return `
            Habilidades: ${habilidades.join("\n")}
            Contexto Pedagógico: ${contexto.contextoPedagogico.abordagem}
            estrategias: ${contexto.contextoPedagogico.estrategias.join(", ")}
            Cultura Digital: ${contexto.culturaDigital.relacao}
            Recursos: ${contexto.culturaDigital.recursos.join(", ")}`.trim();
    } catch (error: any) {
      clearTimeout(timeout);
      if (axios.isCancel(error)) {
        throw new Error("A requisição a api RAG exedeu o tempo limite.");
      }
      if (error instanceof AxiosError) {
        throw new Error(`Erro ao consultar a API de RAG: ${error.message}`);
      }
      throw new Error(`Erro inesperado ao consultar a API de RAG`);
    }
  }
}
