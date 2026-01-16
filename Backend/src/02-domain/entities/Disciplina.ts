import { ano_serie } from "../types/Ano_Serie";
import { disciplina_codigo } from "../types/Disciplina_codigo";

export class Disciplina {
    private id: string;
    private disciplina_codigo: disciplina_codigo;
    private ano_serie: ano_serie;
    constructor(id: string, disciplina_codigo: disciplina_codigo, ano_serie: ano_serie){
        this.id = id;
        this.disciplina_codigo = disciplina_codigo.toLocaleUpperCase() as disciplina_codigo;
        this.ano_serie = ano_serie.toLocaleUpperCase() as ano_serie;
        this.validar();
    }
    private validar(): boolean {
        if (!this.disciplina_codigo || this.disciplina_codigo.trim().length < 2) {
            throw new Error("Código da disciplina inválido");
        }
        if (!this.ano_serie || this.ano_serie.trim().length < 1) {
            throw new Error("Ano/Série inválido");
        }
        return true;
    }
    get DisciplinaID(): string {
        return this.id;
    }
    get disciplinaCodigo(): disciplina_codigo {
        return this.disciplina_codigo;
    }
    get anoSerie(): ano_serie {
        return this.ano_serie;
    }
}