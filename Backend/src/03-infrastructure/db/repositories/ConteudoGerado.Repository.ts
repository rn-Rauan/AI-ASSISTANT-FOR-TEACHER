import { PrismaClient } from "@prisma/client";
import { IConteudoGeradoRepository } from "../../../02-domain/interfaces/IConteudoGeradoRepository";
import { ConteudoGerado } from "../../../02-domain/entities/ConteudoGerado";

/**
 * Implementação do repositório de ConteudoGerado usando Prisma
 */
export class PrismaConteudoGeradoRepository implements IConteudoGeradoRepository {
  constructor(private prisma: PrismaClient) {}

  async criar(conteudoGerado: ConteudoGerado): Promise<ConteudoGerado> {
    const conteudoData = await this.prisma.conteudosGerados.create({
      data: {
        unidade_id: conteudoGerado.UnidadeID,
        tipo: conteudoGerado.Tipo,
        conteudo: conteudoGerado.Conteudo,
      },
    });

    return new ConteudoGerado(
      conteudoData.id,
      conteudoData.unidade_id,
      conteudoData.tipo,
      conteudoData.conteudo,
      conteudoData.created_at,
    );
  }

  async buscarPorID(id: string): Promise<ConteudoGerado | null> {
    const conteudoData = await this.prisma.conteudosGerados.findUnique({
      where: { id },
    });

    if (!conteudoData) return null;

    return new ConteudoGerado(
      conteudoData.id,
      conteudoData.unidade_id,
      conteudoData.tipo,
      conteudoData.conteudo,
      conteudoData.created_at,
    );
  }

  async listarPorUnidade(unidade_id: string): Promise<ConteudoGerado[]> {
    const unidade = await this.prisma.conteudosGerados.findMany({
      where: { unidade_id },
    });

    return unidade.map(
      (ConteudoGeradoData) =>
        new ConteudoGerado(
          ConteudoGeradoData.id,
          ConteudoGeradoData.unidade_id,
          ConteudoGeradoData.tipo,
          ConteudoGeradoData.conteudo,
          ConteudoGeradoData.created_at
        ),
    );
  }
  async update(conteudoAtualizado: ConteudoGerado): Promise<ConteudoGerado> {
    await this.prisma.conteudosGerados.update({
      where: { id: conteudoAtualizado.ConteudoID },
      data: {
        conteudo: conteudoAtualizado.Conteudo,
      },
    });

    return conteudoAtualizado
  }

}
