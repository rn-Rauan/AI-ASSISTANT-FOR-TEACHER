import api from '../http/api';
import type { Unidade } from '../../domain/entities/Unidade';

export const unidadeService = {
  // Listar todas as unidades de uma disciplina específica
  async listarPorDisciplina(disciplinaId: string): Promise<Unidade[]> {
    const response = await api.get('/unidades', {
      params: { disciplina_id: disciplinaId }
    });
    return response.data;
  },

  // Obter uma unidade específica por ID
  async getById(id: string): Promise<Unidade> {
    const response = await api.get(`/unidades/${id}`);
    return response.data;
  },

  // Deletar uma unidade
  async delete(id: string): Promise<void> {
    await api.delete(`/unidades/${id}`);
  }
};
