/**
 * Entidade ConteudoGerado
 * Representa um conteúdo gerado por IA (plano de aula, atividade, slide)
 */
export class ConteudoGerado {
    private id: string;
    private unidade_id: string;
    private tipo: string; // plano_de_aula | atividade | slide
    private conteudo: string;
    private criadoEm: Date | null;

    /**
     * @param id ID do conteúdo gerado
     * @param unidade_id ID da unidade associada
     * @param tipo Tipo do conteúdo
     * @param conteudo Conteúdo gerado em formato texto/markdown
     * @param criadoEm Data de criação
     */
    constructor(
        id: string,
        unidade_id: string,
        tipo: string,
        conteudo: string,
        criadoEm?: Date | null
    ) {
        this.id = id;
        this.unidade_id = unidade_id;
        this.tipo = tipo;
        this.conteudo = conteudo;
        this.criadoEm = criadoEm || null;
        this.validar();
    }

    private validar(): boolean {
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

    get ConteudoID(): string {
        return this.id;
    }

    get UnidadeID(): string {
        return this.unidade_id;
    }

    get Tipo(): string {
        return this.tipo;
    }

    get Conteudo(): string {
        return this.conteudo;
    }

    set Conteudo(novoConteudo: string) {
        if (!novoConteudo || novoConteudo.trim().length < 10) {
            throw new Error("O novo conteúdo deve ter pelo menos 10 caracteres.");
        }
        this.conteudo = novoConteudo;
    }

    get CriadoEm(): Date {
        if (!this.criadoEm) {
            throw new Error("A data de criação do conteúdo é obrigatória.");
        }
        return this.criadoEm;
    }
}
