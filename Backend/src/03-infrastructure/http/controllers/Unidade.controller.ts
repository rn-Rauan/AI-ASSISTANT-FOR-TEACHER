import { FastifyReply, FastifyRequest } from "fastify";
import { CriarUnidadeUseCase } from "../../../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { UnidadeDTO } from "../../../01-application/dtos/UnidadeDTO";
import { BnccService } from "../../service/Bncc.service";

export class UnidadeController {
  constructor(private criarUnidadeUseCase: CriarUnidadeUseCase) {}

  async criarUnidade(req: FastifyRequest, reply: FastifyReply) {
    const { disciplina_id, tema, origem_tema  } = req.body as UnidadeDTO;

    try {
      if (!tema || !origem_tema || !disciplina_id) {
        return reply
          .status(400)
          .send({ message: "Dados incompletos para criar unidade" });
      }

      const unidadeCriada = await this.criarUnidadeUseCase.execute({
        disciplina_id,
        tema,
        origem_tema,
      });

      return reply.status(201).send(unidadeCriada);
    } catch (error) {
      return reply
        .status(500)
        .send({ message: "Erro ao criar unidade", error });
    }
  }
}
