import { Unidade } from "../../../02-domain/entities/Unidade";
export class PrismaUnidadeRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(unidade) {
        if (!unidade) {
            throw new Error("Unidade inválida.");
        }
        const unidadeCriada = await this.prisma.unidades.create({
            data: {
                tema: unidade.Tema,
                disciplina_id: unidade.DisciplinaID,
            },
        });
        return new Unidade(unidadeCriada.id, unidadeCriada.disciplina_id, unidadeCriada.tema, unidadeCriada.created_at);
    }
    async listar(disciplina_id) {
        if (!disciplina_id) {
            const unidadesData = await this.prisma.unidades.findMany();
            const unidadesListadas = unidadesData.map((unidadeData) => {
                return new Unidade(unidadeData.id, unidadeData.disciplina_id, unidadeData.tema, unidadeData.created_at);
            });
            return unidadesListadas;
        }
        const unidadesData = await this.prisma.unidades.findMany({
            where: {
                disciplina_id: disciplina_id,
            },
        });
        const unidadesPorDisciplina = unidadesData.map((unidadeData) => {
            return new Unidade(unidadeData.id, unidadeData.disciplina_id, unidadeData.tema, unidadeData.created_at);
        });
        return unidadesPorDisciplina;
    }
    async findByID(id) {
        const unidadeData = await this.prisma.unidades.findUnique({
            where: {
                id: id,
            },
        });
        if (!unidadeData) {
            return null;
        }
        return new Unidade(unidadeData.id, unidadeData.disciplina_id, unidadeData.tema, unidadeData.created_at);
    }
    async excluir(id) {
        await this.prisma.unidades.delete({
            where: {
                id: id,
            },
        });
    }
}
