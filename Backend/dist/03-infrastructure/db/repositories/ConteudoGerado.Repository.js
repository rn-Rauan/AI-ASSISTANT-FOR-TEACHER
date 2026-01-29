import { ConteudoGerado } from "../../../02-domain/entities/ConteudoGerado";
/**
 * Implementação do repositório de ConteudoGerado usando Prisma
 */
export class PrismaConteudoGeradoRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(conteudoGerado) {
        const conteudoData = await this.prisma.conteudosGerados.create({
            data: {
                unidade_id: conteudoGerado.UnidadeID,
                tipo: conteudoGerado.Tipo,
                conteudo: conteudoGerado.Conteudo,
            },
        });
        return new ConteudoGerado(conteudoData.id, conteudoData.unidade_id, conteudoData.tipo, conteudoData.conteudo, conteudoData.created_at);
    }
    async buscarPorID(id) {
        const conteudoData = await this.prisma.conteudosGerados.findUnique({
            where: { id },
        });
        if (!conteudoData)
            return null;
        return new ConteudoGerado(conteudoData.id, conteudoData.unidade_id, conteudoData.tipo, conteudoData.conteudo, conteudoData.created_at);
    }
    async listarPorUnidade(unidade_id) {
        const unidade = await this.prisma.conteudosGerados.findMany({
            where: { unidade_id },
        });
        return unidade.map((ConteudoGeradoData) => new ConteudoGerado(ConteudoGeradoData.id, ConteudoGeradoData.unidade_id, ConteudoGeradoData.tipo, ConteudoGeradoData.conteudo, ConteudoGeradoData.created_at));
    }
    async update(conteudoAtualizado) {
        await this.prisma.conteudosGerados.update({
            where: { id: conteudoAtualizado.ConteudoID },
            data: {
                conteudo: conteudoAtualizado.Conteudo,
            },
        });
        return conteudoAtualizado;
    }
}
