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
            conteudoData.created_at
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
            conteudoData.created_at
        );
    }

    async listarPorUnidade(unidade_id: string): Promise<ConteudoGerado[]> {
        throw new Error("Method not implemented.");
    }

    async listarPorTipo(unidade_id: string, tipo: string): Promise<ConteudoGerado[]> {
        throw new Error("Method not implemented.");
    }
}
