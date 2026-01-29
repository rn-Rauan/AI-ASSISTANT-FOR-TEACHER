/**
 * Entidade Unidade
 */
export class Unidade {
    /**
     * @param id ID da unidade
     * @param disciplina_id ID da disciplina associada
     * @param tema Tema da unidade
     * @param criadoEm Data de criação
     */
    constructor(id, disciplina_id, tema, criadoEm) {
        this.id = id;
        this.disciplina_id = disciplina_id;
        this.tema = tema;
        this.criadoEm = criadoEm || null;
        this.validar();
    }
    validar() {
        if (!this.tema || this.tema.trim().length < 2) {
            throw new Error("O tema da unidade deve ter pelo menos 2 caracteres.");
        }
        if (!this.disciplina_id) {
            throw new Error("O ID da disciplina associada é obrigatório.");
        }
        return true;
    }
    get UnidadeID() {
        return this.id;
    }
    get DisciplinaID() {
        return this.disciplina_id;
    }
    get Tema() {
        return this.tema;
    }
    get CriadoEm() {
        if (!this.criadoEm) {
            throw new Error("A data de criação da unidade é obrigatória.");
        }
        return this.criadoEm;
    }
}
