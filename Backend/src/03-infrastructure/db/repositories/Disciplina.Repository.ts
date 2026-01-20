import { PrismaClient } from "@prisma/client";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { disciplina_codigo } from "../../../02-domain/types/Disciplina_codigo";
import { ano_serie } from "../../../02-domain/types/Ano_Serie";

export class PrismaDisciplinaRepository implements IDisciplinaRepository {
  constructor(private prisma: PrismaClient) {}
  async criar(disciplina: Disciplina): Promise<Disciplina> {
    const disciplinaData = await this.prisma.disciplinas.create({
      data: {
        disciplina_codigo: disciplina.disciplinaCodigo,
        ano_serie: disciplina.anoSerie,
      },
    });
    return new Disciplina(
      disciplinaData.id,
      disciplinaData.disciplina_codigo as disciplina_codigo,
      disciplinaData.ano_serie as ano_serie
    );
  }
  async listar(): Promise<Disciplina[]> {
    const disciplinasData = await this.prisma.disciplinas.findMany();
    const disciplinasListadas = disciplinasData.map((disciplinasData) => {
      return new Disciplina(
        disciplinasData.id,
        disciplinasData.disciplina_codigo as disciplina_codigo,
        disciplinasData.ano_serie as ano_serie
      );
    });
    return disciplinasListadas;
  }
  async findByID(id: string): Promise<Disciplina | null> {
    const disciplinaData = await this.prisma.disciplinas.findUnique({
      where: {
        id: id,
      },
    });
    if (!disciplinaData) return null;
    return new Disciplina(
      disciplinaData.id,
      disciplinaData.disciplina_codigo as disciplina_codigo,
      disciplinaData.ano_serie as ano_serie
    );
  }
  async excluir(id: string): Promise<void> {
    await this.prisma.disciplinas.delete({
      where: {
        id: id,
      },
    });
  }
}
