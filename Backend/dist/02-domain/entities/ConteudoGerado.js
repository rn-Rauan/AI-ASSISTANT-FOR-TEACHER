/**
 * Entidade ConteudoGerado
 * Representa um conteúdo gerado por IA (plano de aula, atividade, slide)
 */
export class ConteudoGerado {
    /**
     * @param id ID do conteúdo gerado
     * @param unidade_id ID da unidade associada
     * @param tipo Tipo do conteúdo
     * @param conteudo Conteúdo gerado em formato texto/markdown
     * @param criadoEm Data de criação
     */
    constructor(id, unidade_id, tipo, conteudo, criadoEm) {
        this.id = id;
        this.unidade_id = unidade_id;
        this.tipo = tipo;
        this.conteudo = conteudo;
        this.criadoEm = criadoEm || null;
        this.validar();
    }
    validar() {
        if (!this.unidade_id) {
            throw new Error("O ID da unidade é obrigatório.");
        }
        if (!this.tipo || !["plano_de_aula", "atividade", "slide"].includes(this.tipo)) {
            throw new Error("Tipo de conteúdo inválido. Use: plano_de_aula, atividade ou slide.");
        }
        if (!this.conteudo || this.conteudo.trim().length < 10) {
            throw new Error("O conteúdo deve ter pelo menos 10 caracteres.");
        }
        return true;
    }
    get ConteudoID() {
        return this.id;
    }
    get UnidadeID() {
        return this.unidade_id;
    }
    get Tipo() {
        return this.tipo;
    }
    get Conteudo() {
        return this.conteudo;
    }
    set Conteudo(novoConteudo) {
        if (!novoConteudo || novoConteudo.trim().length < 10) {
            throw new Error("O novo conteúdo deve ter pelo menos 10 caracteres.");
        }
        this.conteudo = novoConteudo;
    }
    get CriadoEm() {
        if (!this.criadoEm) {
            throw new Error("A data de criação do conteúdo é obrigatória.");
        }
        return this.criadoEm;
    }
}
