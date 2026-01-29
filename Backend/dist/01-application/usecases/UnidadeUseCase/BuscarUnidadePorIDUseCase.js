export class BuscarUnidadePorIDUseCase {
    /**
     *
     * @param unidadeRepository Repositório de unidades
     */
    constructor(unidadeRepository, conteudoGeradoRepository) {
        this.unidadeRepository = unidadeRepository;
        this.conteudoGeradoRepository = conteudoGeradoRepository;
    }
    /**
     *
     * @param id ID da unidade a ser buscada
     * @returns Unidade encontrada ou null se não existir
     */
    async execute(id) {
        if (!id || id.trim() == "") {
            throw new Error("ID da unidade é obrigatório.");
        }
        const unidade = await this.unidadeRepository.findByID(id);
        if (!unidade) {
            return null;
        }
        const conteudos = await this.conteudoGeradoRepository.listarPorUnidade(unidade.UnidadeID);
        return {
            id: unidade.UnidadeID,
            disciplinaID: unidade.DisciplinaID,
            tema: unidade.Tema,
            criadoEm: unidade.CriadoEm,
            conteudos: conteudos.map((conteudo) => ({
                id: conteudo.ConteudoID,
                unidadeID: conteudo.UnidadeID,
                tipo: conteudo.Tipo,
                conteudo: conteudo.Conteudo,
                criadoEm: conteudo.CriadoEm,
            })),
        };
    }
}
