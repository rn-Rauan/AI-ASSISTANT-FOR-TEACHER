/**
 * Entidade Unidade
 */
export class Unidade {
    private id: string;
    private disciplina_id: string;
    private tema: string;
    private criadoEm: Date | null

    /**
     * @param id ID da unidade
     * @param disciplina_id ID da disciplina associada
     * @param tema Tema da unidade
     * @param criadoEm Data de criação
     */
    constructor(id: string, disciplina_id: string, tema: string, criadoEm?: Date | null) {
        this.id = id;
        this.disciplina_id = disciplina_id;
        this.tema = tema;
        this.criadoEm = criadoEm || null;
        this.validar();
    }

    private validar(): boolean {
        if (!this.tema || this.tema.trim().length < 2) {
            throw new Error("O tema da unidade deve ter pelo menos 2 caracteres.");
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
    get CriadoEm(): Date {
        if (!this.criadoEm) {
            throw new Error("A data de criação da unidade é obrigatória.");
        }
        return this.criadoEm;
    }
}