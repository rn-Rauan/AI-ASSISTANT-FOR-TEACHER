import { FastifyReply, FastifyRequest } from "fastify";
import { CriarUnidadeUseCase } from "../../../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { UnidadeDTO } from "../../../01-application/dtos/UnidadeDTO";
import { ListarUnidadesUseCase } from "../../../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";

export class UnidadeController {
  constructor(private criarUnidadeUseCase: CriarUnidadeUseCase, private listarUnidadeUseCase: ListarUnidadesUseCase) {}

  async criarUnidade(req: FastifyRequest, reply: FastifyReply) {
    const { disciplina_id, tema, origem_tema } = req.body as UnidadeDTO;

    try {
      if (!tema || !origem_tema || !disciplina_id) {
        return reply
          .status(400)
          .send({
            message: "Campos obrigatórios: tema, origem_tema, disciplina_id",
          });
      }

      const unidadeCriada = await this.criarUnidadeUseCase.execute({
        disciplina_id,
        tema,
        origem_tema,
      });

      return reply.status(201).send(unidadeCriada);
    } catch (error: any) {
      return reply
        .status(500)
        .send({ message: "Erro ao criar unidade", error: error.message });
    }
  }
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
}
