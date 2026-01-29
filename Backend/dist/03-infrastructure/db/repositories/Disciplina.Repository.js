import { Disciplina } from "../../../02-domain/entities/Disciplina";
export class PrismaDisciplinaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async criar(disciplina) {
        const disciplinaData = await this.prisma.disciplinas.create({
            data: {
                disciplina_codigo: disciplina.disciplinaCodigo,
                ano_serie: disciplina.anoSerie,
            },
        });
        return new Disciplina(disciplinaData.id, disciplinaData.disciplina_codigo, disciplinaData.ano_serie);
    }
    async listar() {
        const disciplinasData = await this.prisma.disciplinas.findMany();
        const disciplinasListadas = disciplinasData.map((disciplinasData) => {
            return new Disciplina(disciplinasData.id, disciplinasData.disciplina_codigo, disciplinasData.ano_serie);
        });
        return disciplinasListadas;
    }
    async findByID(id) {
        const disciplinaData = await this.prisma.disciplinas.findUnique({
            where: {
                id: id,
            },
        });
        if (!disciplinaData)
            return null;
        return new Disciplina(disciplinaData.id, disciplinaData.disciplina_codigo, disciplinaData.ano_serie);
    }
    async excluir(id) {
        await this.prisma.disciplinas.delete({
            where: {
                id: id,
            },
        });
    }
}
