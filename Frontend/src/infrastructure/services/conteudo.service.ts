import api from '../http/api';
import type { Conteudo } from '../../domain/entities/Conteudo';
import type { GerarConteudoDTO } from '../../domain/dtos/GerarConteudoDTO';
import type { RefinarConteudoDTO } from '../../domain/dtos/RefinarConteudoDTO';
import type { Unidade } from '../../domain/entities/Unidade';

interface GerarConteudoResponse {
  message: string;
  unidade: Unidade;
  conteudos: Conteudo[];
}

interface AtualizarConteudoResponse {
  message: string;
  conteudoAtualizado: Conteudo;
}

export interface ConteudoRefinado extends Conteudo {
  mensagemIA: string;
}

export type RefinarConteudoResponse = ConteudoRefinado[];

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

  // Atualizar um conteúdo existente
  async atualizar(conteudoId: string, conteudo: string): Promise<AtualizarConteudoResponse> {
    const response = await api.put(`/conteudos/${conteudoId}`, { conteudo });
    return response.data;
  },

  // Refinar múltiplos conteúdos de uma unidade com base em instrução
  async refinar(dados: RefinarConteudoDTO): Promise<RefinarConteudoResponse> {
    const response = await api.post('/conteudos/refinar', dados);
    return response.data;
  },

  // Sugerir temas baseados na BNCC
  async sugerirTemas(disciplinaId: string): Promise<string[]> {
    const response = await api.get(`/disciplinas/${disciplinaId}/sugerir-temas`);
    return response.data.temas;
  }
};