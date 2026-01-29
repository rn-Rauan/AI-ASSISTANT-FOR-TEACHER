export class UnidadeController {
    constructor(listarUnidadeUseCase, buscarUnidadePorIDUseCase, deleteUnidadeUseCase) {
        this.listarUnidadeUseCase = listarUnidadeUseCase;
        this.buscarUnidadePorIDUseCase = buscarUnidadePorIDUseCase;
        this.deleteUnidadeUseCase = deleteUnidadeUseCase;
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da disciplina
     * @param reply Resposta HTTP com a lista de unidades
     */
    async listarUnidades(req, reply) {
        try {
            const { disciplina_id } = req.query;
            if (!disciplina_id) {
                return reply.status(400).send({
                    message: "Campo obrigatório: disciplina_id",
                });
            }
            const unidades = await this.listarUnidadeUseCase.execute(disciplina_id);
            return reply.status(200).send(unidades);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply
                .status(500)
                .send({ message: "Erro ao listar unidades", error: message });
        }
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da unidade
     * @param reply Resposta HTTP com a unidade encontrada
     */
    async buscarUnidadePorID(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply
                    .status(400)
                    .send({ message: "ID da unidade é obrigatório." });
            }
            const unidade = await this.buscarUnidadePorIDUseCase.execute(id);
            if (!unidade) {
                return reply.status(404).send({ message: "Unidade não encontrada." });
            }
            return reply.status(200).send(unidade);
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply
                .status(500)
                .send({ message: "Erro ao buscar unidade por ID", error: message });
        }
    }
    /**
     *
     * @param req Requisição HTTP contendo o ID da unidade
     * @param reply Resposta HTTP com a mensagem de sucesso
     */
    async deleteUnidade(req, reply) {
        try {
            const { id } = req.params;
            if (!id) {
                return reply
                    .status(400)
                    .send({ message: "ID da unidade é obrigatório." });
            }
            const sucesso = await this.deleteUnidadeUseCase.execute(id);
            if (!sucesso) {
                return reply.status(404).send({ message: "Unidade não encontrada." });
            }
            return reply
                .status(200)
                .send({ message: "Unidade excluída com sucesso." });
        }
        catch (error) {
            const message = error instanceof Error ? error.message : "Erro desconhecido";
            return reply
                .status(500)
                .send({ message: "Erro ao excluir unidade", error: message });
        }
    }
}
