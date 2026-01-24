import api from '../http/api';
import type { Conteudo } from '../../domain/entities/Conteudo';
import type { GerarConteudoDTO } from '../../domain/dtos/GerarConteudoDTO';
import type { Unidade } from '../../domain/entities/Unidade';

interface GerarConteudoResponse {
  unidade: Unidade;
  conteudos: Conteudo[];
}

export const conteudoService = {
  // A rota principal que cria unidade e gera conteúdos via IA
  async gerar(dados: GerarConteudoDTO): Promise<GerarConteudoResponse> {
    const response = await api.post('/gerar/conteudos', dados);
    return response.data;
  },

  // Listar conteúdos já gerados de uma unidade
  async listarPorUnidade(unidadeId: string): Promise<Conteudo[]> {
    // A rota no backend é GET /conteudos/:id_da_unidade
    const response = await api.get(`/conteudos/${unidadeId}`);
    return response.data;
  },

  // Sugerir temas baseados na BNCC
  async sugerirTemas(disciplinaId: string): Promise<string[]> {
    const response = await api.get(`/disciplinas/${disciplinaId}/sugerir-temas`);
    return response.data.temas;
  }
};
