export class Disciplina {
    constructor(id, disciplina_codigo, ano_serie) {
        this.id = id;
        this.disciplina_codigo = disciplina_codigo.toLocaleUpperCase();
        this.ano_serie = ano_serie.toLocaleUpperCase();
        this.validar();
    }
    validar() {
        if (!this.disciplina_codigo || this.disciplina_codigo.trim().length < 2) {
            throw new Error("Código da disciplina inválido");
        }
        if (!this.ano_serie || this.ano_serie.trim().length < 1) {
            throw new Error("Ano/Série inválido");
        }
        return true;
    }
    get DisciplinaID() {
        return this.id;
    }
    get disciplinaCodigo() {
        return this.disciplina_codigo;
    }
    get anoSerie() {
        return this.ano_serie;
    }
}
