import api from '../http/api';
import type { Disciplina } from '../../domain/entities/Disciplina';
import type { CriarDisciplinaDTO } from '../../domain/dtos/CriarDisciplinaDTO';

export const disciplinaService = {
  async getAll(): Promise<Disciplina[]> {
    const response = await api.get('/disciplinas');
    return response.data;
  },

  async getById(id: string): Promise<Disciplina> {
    const response = await api.get(`/disciplinas/${id}`);
    return response.data;
  },

  async create(data: CriarDisciplinaDTO): Promise<Disciplina> {
      const response = await api.post('/disciplinas', data);
      return response.data;
  },

  async delete(id: string): Promise<void> {
      await api.delete(`/disciplinas/${id}`);
  }
};
