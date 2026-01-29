import axios, { AxiosError } from "axios";
import { obterNomeAnoSerie } from "../../02-domain/mappings/Ano_Serie_nome";
import { obterNomeDisciplina } from "../../02-domain/mappings/Disciplina_nome";
/**
 * Serviço simples para consultar a API de RAG
 */
export class RagBnccService {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
    }
    async consultarBNCC(consulta) {
        const consultaFormatada = {
            tema: consulta.tema,
            disciplina: obterNomeDisciplina(consulta.disciplina_codigo),
            serie: obterNomeAnoSerie(consulta.ano_serie),
        };
        const abortController = new AbortController();
        const timeout = setTimeout(() => abortController.abort(), 120000); // 120 segundos
        try {
            const response = await axios.post(`${this.apiUrl}/api/gerar-contexto`, consultaFormatada, { signal: abortController.signal });
            clearTimeout(timeout);
            const data = response.data;
            // Retorna o contexto já formatado
            const contexto = data.contexto;
            const habilidades = contexto.habilidadesBNCC.map((hab) => `- [${hab.codigo}] ${hab.descricao}`);
            return `
            Habilidades: ${habilidades.join("\n")}
            Contexto Pedagógico: ${contexto.contextoPedagogico.abordagem}
            estrategias: ${contexto.contextoPedagogico.estrategias.join(", ")}
            Cultura Digital: ${contexto.culturaDigital.relacao}
            Recursos: ${contexto.culturaDigital.recursos.join(", ")}`.trim();
        }
        catch (error) {
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
