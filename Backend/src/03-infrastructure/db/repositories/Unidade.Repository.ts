import { PrismaClient } from "@prisma/client";
import { IUnidadeRepository } from "../../../02-domain/interfaces/IUnidadeRepository";
import { Unidade } from "../../../02-domain/entities/Unidade";
import { origem_tema } from "../../../02-domain/types/Origem_Tema";

export class PrismaUnidadeRepository implements IUnidadeRepository {
  constructor(private prisma: PrismaClient) {}

  async criar(unidade: Unidade): Promise<Unidade> {
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
      unidadeCriada.origem_tema as origem_tema
    );
  }
  async listar(): Promise<Unidade[]> {
    throw new Error("Method not implemented.");
  }
  async findByID(id: string): Promise<Unidade | null> {
    throw new Error("Method not implemented.");
  }
  async excluir(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
