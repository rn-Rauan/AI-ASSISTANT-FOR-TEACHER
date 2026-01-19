import axios from "axios";
import { IRagBnccService } from "../../02-domain/interfaces/IRagBnccService";
import { ConsultarRAG } from "../../01-application/dtos/ConsultarRAG";
import { ano_serie_map, obterNomeAnoSerie } from "../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../02-domain/mappings/Disciplina_nome";
import { RagApiResponseDTO } from "../../01-application/dtos/RagApiResponseDTO";

/**
 * Serviço simples para consultar a API de RAG
 */
export class RagBnccService implements IRagBnccService {
    private apiUrl: string;
    constructor(apiUrl: string) {
        this.apiUrl = apiUrl;
    }

    async consultarBNCC(consulta: ConsultarRAG): Promise<string> {
        const consultaFormatada = {
            tema: consulta.tema,
            disciplina: obterNomeDisciplina(consulta.disciplina_codigo),
            serie: obterNomeAnoSerie(consulta.ano_serie),
        }

        const response = await axios.post<RagApiResponseDTO>(`${this.apiUrl}/api/gerar-contexto`, consultaFormatada);

        const data = response.data;
        // Retorna o contexto já formatado
        const contexto = data.contexto;

        const habilidades = contexto.habilidadesBNCC.map(hab => `- [${hab.codigo}] ${hab.descricao}`);

        return `
            Referência BNCC: ${data.bnccReferencia}
            Competências: ${contexto.competenciasBNCC ? contexto.competenciasBNCC.join(", ") : 'N/A'}
            Habilidades: ${habilidades.join("\n")}
            Contexto Pedagógico: ${contexto.contextoPedagogico.abordagem}
            Cultura Digital: ${contexto.culturaDigital.relacao}
            Recursos: ${contexto.culturaDigital.recursos.join(", ")}`.trim();
    }
}
