import { ano_serie } from "../types/Ano_Serie";
import { discplina_codigo } from "../types/Discplina_codigo";

export class Disciplina {
    private id: string;
    private disciplina_codigo: discplina_codigo;
    private ano_serie: ano_serie;
    constructor(id: string, disciplina_codigo: discplina_codigo, ano_serie: ano_serie){
        this.id = id;
        this.disciplina_codigo = disciplina_codigo;
        this.ano_serie = ano_serie;
    }
    get disciplinaCodigo(): discplina_codigo {
        return this.disciplina_codigo;
    }
    get anoSerie(): string {
        return this.ano_serie;
    }
}