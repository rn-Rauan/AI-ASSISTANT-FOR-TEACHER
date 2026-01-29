export class DisciplinaController {
    /**
     * Controlador para operações relacionadas a Disciplina
     * @param criarDisciplinaUseCase Caso de uso para criar disciplina
    */
    constructor(criarDisciplinaUseCase, listarDisciplinaUseCase, deleteDisciplinaUseCase, listarDisciplinaPorIDUseCase) {
        this.criarDisciplinaUseCase = criarDisciplinaUseCase;
        this.listarDisciplinaUseCase = listarDisciplinaUseCase;
        this.deleteDisciplinaUseCase = deleteDisciplinaUseCase;
        this.listarDisciplinaPorIDUseCase = listarDisciplinaPorIDUseCase;
    }
    /**
     *
     * @param req Requisição HTTP contendo os dados da disciplina
     * @param reply Resposta HTTP com a disciplina criada
     */
    async criarDisciplina(req, reply) {
        try {
            const { disciplina_codigo, ano_serie } = req.body;
            if (!disciplina_codigo || !ano_serie) {
                return reply.status(400).send({
                    message: "Campos disciplina_codigo e ano_serie são obrigatórios.",
                });
            }
            const disciplinaCriada = await this.criarDisciplinaUseCase.execute({
                disciplina_codigo,
                ano_serie,
            });
            return reply.status(201).send(disciplinaCriada);
        }
        catch (erro) {
            const message = erro instanceof Error ? erro.message : "Erro desconhecido";
            return reply.status(500).send({ message: "Erro ao criar disciplina", error: message });
        }
    } /**
     *
     * @param _req Requisição HTTP vazia
     * @param reply Resposta HTTP com a lista de disciplinas
     */
    async listarDisciplinas(_req, reply) {
        try {
            const disciplinas = await this.listarDisciplinaUseCase.execute();
            return reply.status(200).send(disciplinas);
        }
        catch (erro) {
            const message = erro instanceof Error ? erro.message : "Erro desconhecido";
            return reply.status(500).send({ message: "Erro ao listar disciplinas", error: message });
        }
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da disciplina
     * @param reply Resposta HTTP com a mensagem de sucesso
     */
    async deletarDisciplina(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply.status(400).send({ message: "ID da disciplina é obrigatório." });
            }
            await this.deleteDisciplinaUseCase.execute(id);
            return reply.status(200).send({ message: "Disciplina deletada com sucesso" });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply.status(500).send({ message: "Erro ao deletar disciplina", error: message });
        }
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da disciplina
     * @param reply Resposta HTTP com a disciplina encontrada
     */
    async obterDisciplinaPorID(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply.status(400).send({ message: "ID da disciplina é obrigatório." });
            }
            const disciplina = await this.listarDisciplinaPorIDUseCase.execute(id);
            if (!disciplina) {
                return reply.status(404).send({ message: "Disciplina não encontrada." });
            }
            return reply.status(200).send(disciplina);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply.status(500).send({ message: "Erro ao obter disciplina por ID", error: message });
        }
    }
}
