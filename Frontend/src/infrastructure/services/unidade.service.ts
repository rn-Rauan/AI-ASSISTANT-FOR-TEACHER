import api from '../http/api';
import type { Unidade } from '../../domain/entities/Unidade';
import type { CriarUnidadeDTO } from '../../domain/dtos/CriarUnidadeDTO';

export const unidadeService = {
  // Listar todas as unidades de uma disciplina específica
  async listarPorDisciplina(disciplinaId: string): Promise<Unidade[]> {
    const response = await api.get('/unidades', {
      params: { disciplina_id: disciplinaId }
    });
    return response.data;
  },

  async getById(id: string): Promise<Unidade> {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  },

  async create(data: CriarUnidadeDTO): Promise<Unidade> {
    const response = await api.post('/gerar/conteudos', data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/unidades/${id}`);
  }
};
