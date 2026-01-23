import api from '../http/api';
import type { Disciplina } from '../../domain/entities/Disciplina';

export const disciplinaService = {
  async getAll(): Promise<Disciplina[]> {
    const response = await api.get<Disciplina[]>('/disciplinas');
    return response.data;
  },

  async getById(id: string): Promise<Disciplina> {
    const response = await api.get<Disciplina>(`/disciplinas/${id}`);
    return response.data;
  },
};
