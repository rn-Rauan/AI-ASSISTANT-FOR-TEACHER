import { origem_tema } from "../types/Origem_Tema";

/**
 * Entidade Unidade
 */
export class Unidade {
    private id: string;
    private disciplina_id: string;
    private tema: string; 
    private origem_tema: origem_tema;

    /**
     * @param id ID da unidade
     * @param disciplina_id ID da disciplina associada
     * @param tema Tema da unidade
     * @param origem_tema Origem do tema da unidade
     */
    constructor(id: string, disciplina_id: string, tema: string, origem_tema: origem_tema){
        this.id = id;
        this.disciplina_id = disciplina_id;
        this.tema = tema;
        this.origem_tema = origem_tema.toLocaleUpperCase() as origem_tema;
        this.validar();
    }

    private validar(): boolean {
        if (!this.tema || this.tema.trim().length < 2) {
            throw new Error("O tema da unidade deve ter pelo menos 2 caracteres.");
        }
        if (!this.origem_tema || (this.origem_tema != "BNCC" && this.origem_tema != "MANUAL")) {
            throw new Error("A origem do tema da unidade deve ser 'BNCC' ou 'MANUAL'.");
        }
        if (!this.disciplina_id) {
            throw new Error("O ID da disciplina associada é obrigatório.");
        }
        return true;
    }

    get UnidadeID(): string {
        return this.id;
    }
    get DisciplinaID(): string {
        return this.disciplina_id;
    }
    get Tema(): string {
        return this.tema;
    }
    get OrigemTema(): origem_tema {
        return this.origem_tema;
    }
}