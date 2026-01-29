/**
 * UseCase para refinar conteúdos gerados
 */
export class RefinarConteudoUseCase {
    /**
     *
     * @param conteudoRepository Repositório para operações de persistência de conteúdo gerado
     * @param unidadeRepository Repositório para operações de persistência de unidade
     * @param AIservice Serviço de IA para refinar conteúdo
     */
    constructor(conteudoRepository, unidadeRepository, AIservice) {
        this.conteudoRepository = conteudoRepository;
        this.unidadeRepository = unidadeRepository;
        this.AIservice = AIservice;
    }
    async execute(unidadeID, conteudosIDs, instrucao) {
        if (!unidadeID || unidadeID.trim().length == 0) {
            throw new Error("ID da unidade é obrigatório");
        }
        if (conteudosIDs.length == 0) {
            throw new Error("Não ha conteúdos para refinar");
        }
        if (!instrucao || instrucao.trim().length < 2) {
            throw new Error("Instrução inválida");
        }
        const unidade = await this.unidadeRepository.findByID(unidadeID);
        if (!unidade) {
            throw new Error("Unidade não encontrada");
        }
        const promisasDeRefinamento = conteudosIDs.map(async (conteudoID) => {
            // Buscar o conteúdo no banco de dados - assim temos a instância correta da classe
            const conteudoExistente = await this.conteudoRepository.buscarPorID(conteudoID);
            if (!conteudoExistente) {
                throw new Error(`Conteúdo com ID ${conteudoID} não encontrado`);
            }
            let respostaRefinamento;
            switch (conteudoExistente.Tipo) {
                case "plano_de_aula":
                    respostaRefinamento = await this.AIservice.refinarPlanoDeAula(conteudoExistente.Conteudo, instrucao);
                    break;
                case "atividade":
                    respostaRefinamento = await this.AIservice.refinarAtividade(conteudoExistente.Conteudo, instrucao);
                    break;
                case "slide":
                    respostaRefinamento = await this.AIservice.refinarSlide(conteudoExistente.Conteudo, instrucao);
                    break;
                default:
                    throw new Error(`Tipo ${conteudoExistente.Tipo} não implementado`);
            }
            conteudoExistente.Conteudo = respostaRefinamento.conteudo;
            const conteudoAtualizado = await this.conteudoRepository.update(conteudoExistente);
            return {
                id: conteudoAtualizado.ConteudoID,
                unidadeID: conteudoAtualizado.UnidadeID,
                tipo: conteudoAtualizado.Tipo,
                conteudo: conteudoAtualizado.Conteudo,
                criadoEm: conteudoAtualizado.CriadoEm,
                mensagemIA: respostaRefinamento.mensagemIA,
            };
        });
        const conteudosRefinados = await Promise.all(promisasDeRefinamento);
        return conteudosRefinados.filter(conteudo => conteudo != null);
    }
}
