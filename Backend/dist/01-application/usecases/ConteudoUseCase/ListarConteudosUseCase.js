/**
 * UseCase para listar conteúdos de uma unidade
 */
export class ListarConteudosUseCase {
    /**
     *
     * @param conteudoGeradoRepository Repositório para acesso aos conteúdos gerados
     */
    constructor(conteudoGeradoRepository) {
        this.conteudoGeradoRepository = conteudoGeradoRepository;
    }
    /**
     *
     * @param unidade_id ID da unidade cujos conteúdos serão listados
     * @returns Lista de conteúdos gerados para a unidade
     */
    async execute(unidade_id) {
        const conteudos = await this.conteudoGeradoRepository.listarPorUnidade(unidade_id);
        return conteudos.map((conteudo) => ({
            id: conteudo.ConteudoID,
            unidadeID: conteudo.UnidadeID,
            tipo: conteudo.Tipo,
            conteudo: conteudo.Conteudo,
            criadoEm: conteudo.CriadoEm,
        }));
    }
}
