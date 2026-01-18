import { PrismaClient } from "@prisma/client";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { Unidade } from "../../../02-domain/entities/Unidade";
import { origem_tema } from "../../../02-domain/types/Origem_Tema";

export class PrismaUnidadeRepository implements IUnidadeRepository {
  constructor(private prisma: PrismaClient) {}

  async criar(unidade: Unidade): Promise<Unidade> {
    if (!unidade) {
      throw new Error("Unidade inválida.");
    }
    const unidadeCriada = await this.prisma.unidades.create({
      data: {
        tema: unidade.Tema,
        origem_tema: unidade.OrigemTema as origem_tema,
        disciplina_id: unidade.DisciplinaID,
      },
    });
    return new Unidade(
      unidadeCriada.id,
      unidadeCriada.disciplina_id,
      unidadeCriada.tema,
      unidadeCriada.origem_tema as origem_tema,
      unidadeCriada.created_at
    );
  }
  async listar(disciplina_id?: string): Promise<Unidade[]> {
    if (!disciplina_id) {
      const unidadesData = await this.prisma.unidades.findMany();
      const unidadesListadas = unidadesData.map((unidadeData) => {
        return new Unidade(
          unidadeData.id,
          unidadeData.disciplina_id,
          unidadeData.tema,
          unidadeData.origem_tema as origem_tema,
          unidadeData.created_at
        );
      });
      return unidadesListadas;
    }
    const unidadesData = await this.prisma.unidades.findMany({
      where: {
        disciplina_id: disciplina_id,
      },
    });
    const unidadesPorDisciplina = unidadesData.map((unidadeData) => {
      return new Unidade(
        unidadeData.id,
        unidadeData.disciplina_id,
        unidadeData.tema,
        unidadeData.origem_tema as origem_tema,
        unidadeData.created_at
      );
    });
    return unidadesPorDisciplina;
  }
  async findByID(id: string): Promise<Unidade | null> {
    const unidadeData = await this.prisma.unidades.findUnique({
      where: {
        id: id,
      },
    });
    if (!unidadeData) {
      return null;
    }
    return new Unidade(
      unidadeData.id,
      unidadeData.disciplina_id,
      unidadeData.tema,
      unidadeData.origem_tema as origem_tema,
      unidadeData.created_at
    );
  }
  async excluir(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
