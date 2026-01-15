import { PrismaClient } from "@prisma/client";
import { IDisciplinaRepository } from "../../../02-domain/interfaces/IDisciplinaRepository";
import { Disciplina } from "../../../02-domain/entities/Disciplina";
import { discplina_codigo } from "../../../02-domain/types/Discplina_codigo";
import { ano_serie } from "../../../02-domain/types/Ano_Serie";

export class PrismaDisciplinaRepository implements IDisciplinaRepository {
    constructor(private prisma: PrismaClient){

    }
    async criar(disciplina: Disciplina): Promise<Disciplina> {
        const disciplinaData = await this.prisma.disciplinas.create({
            data: {
                disciplina_codigo: disciplina.disciplinaCodigo,
                ano_serie: disciplina.anoSerie,
            }
        })
        return new Disciplina(
            disciplinaData.id,
            disciplinaData.disciplina_codigo as discplina_codigo,
            disciplinaData.ano_serie as ano_serie
        );
    }
    listar(): Promise<Disciplina[]> {
        throw new Error("Method not implemented.");
    }
    buscarPorId(id: string): Promise<Disciplina | null> {
        throw new Error("Method not implemented.");
    }
    excluir(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}