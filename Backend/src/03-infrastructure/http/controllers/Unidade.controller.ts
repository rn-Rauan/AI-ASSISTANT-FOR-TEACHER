import { FastifyReply, FastifyRequest } from "fastify";
import { CriarUnidadeUseCase } from "../../../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { UnidadeDTO } from "../../../01-application/dtos/UnidadeDTO";
import { ListarUnidadesUseCase } from "../../../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";
import { BuscarUnidadePorIDUseCase } from "../../../01-application/usecases/UnidadeUseCase/BuscarUnidadePorIDUseCase";
import { DeleteUnidadeUseCase } from "../../../01-application/usecases/UnidadeUseCase/DeleteUnidadeUseCase";

export class UnidadeController {
  constructor(private criarUnidadeUseCase: CriarUnidadeUseCase, private listarUnidadeUseCase: ListarUnidadesUseCase, private buscarUnidadePorIDUseCase: BuscarUnidadePorIDUseCase, private deleteUnidadeUseCase: DeleteUnidadeUseCase) { }
  /**
   * 
   * @param req Requisição HTTP contendo os dados da unidade
   * @param reply Resposta HTTP com a unidade criada 
   */
  async criarUnidade(req: FastifyRequest, reply: FastifyReply) {

    try {
      const { disciplina_id, tema } = req.body as UnidadeDTO;

      if (!tema || !disciplina_id) {
        return reply
          .status(400)
          .send({
            message: "Campos obrigatórios: disciplina_id, tema",
          });
      }

      const unidadeCriada = await this.criarUnidadeUseCase.execute({
        disciplina_id,
        tema,
      });

      return reply.status(201).send(unidadeCriada);

    } catch (error: any) {
      return reply
        .status(500)
        .send({ message: "Erro ao criar unidade", error: error.message });
    }
  }
  /**
   * 
   * @param req Requisição HTTP contendo o ID da disciplina
   * @param reply Resposta HTTP com a lista de unidades
   */
  async listarUnidades(req: FastifyRequest, reply: FastifyReply) {
    try {

      const { disciplina_id } = req.query as { disciplina_id?: string };

      if (!disciplina_id) {
        return reply
          .status(400)
          .send({
            message: "Campo obrigatório: disciplina_id",
          });
      }

      const unidades = await this.listarUnidadeUseCase.execute(disciplina_id);

      return reply.status(200).send(unidades);

    } catch (error: any) {
      return reply
        .status(500)
        .send({ message: "Erro ao listar unidades", error: error.message });
    }
  }
  /**
   * 
   * @param req Requisição HTTP contendo o ID da unidade
   * @param reply Resposta HTTP com a unidade encontrada
   */
  async buscarUnidadePorID(req: FastifyRequest, reply: FastifyReply) {

    try {

      const { id } = req.params as { id: string };
      if (!id) {
        return reply.status(400).send({ message: "ID da unidade é obrigatório." });
      }

      const unidade = await this.buscarUnidadePorIDUseCase.execute(id);

      if (!unidade) {
        return reply.status(404).send({ message: "Unidade não encontrada." });
      }

      return reply.status(200).send(unidade);
    } catch (error: any) {
      return reply
        .status(500)
        .send({ message: "Erro ao buscar unidade por ID", error: error.message });
    }
  }
  /**
   * 
   * @param req Requisição HTTP contendo o ID da unidade
   * @param reply Resposta HTTP com a mensagem de sucesso
   */
  async deleteUnidade(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        return reply.status(400).send({ message: "ID da unidade é obrigatório." });
      }

      const sucesso = await this.deleteUnidadeUseCase.execute(id);

      if (!sucesso) {
        return reply.status(404).send({ message: "Unidade não encontrada." });
      }

      return reply.status(200).send({ message: "Unidade excluída com sucesso." });
    } catch (error: any) {
      return reply
        .status(500)
        .send({ message: "Erro ao excluir unidade", error: error.message });
    }
  }
}
