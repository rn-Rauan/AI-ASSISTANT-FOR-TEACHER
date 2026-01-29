export class ListarUnidadesUseCase {
    /**
     * @param unidadeRepository repositório de unidades
     * @param disciplinaRepository repositório de disciplinas
     */
    constructor(unidadeRepository, disciplinaRepository) {
        this.unidadeRepository = unidadeRepository;
        this.disciplinaRepository = disciplinaRepository;
    }
    /**
     *
     * @param disciplina_id ID da disciplina para filtrar as unidades
     * @returns Lista de unidades de una disciplina específica
     */
    async execute(disciplina_id) {
        if (!disciplina_id) {
            throw new Error("O ID da disciplina é obrigatório para listar as unidades.");
        }
        const disciplinaExiste = await this.disciplinaRepository.findByID(disciplina_id);
        if (!disciplinaExiste) {
            throw new Error("Disciplina não encontrada.");
        }
        const unidades = await this.unidadeRepository.listar(disciplinaExiste.DisciplinaID);
        return unidades.map((unidades) => ({
            id: unidades.UnidadeID,
            disciplinaID: unidades.DisciplinaID,
            tema: unidades.Tema,
            criadoEm: unidades.CriadoEm,
            conteudos: [],
        }));
    }
}
