import { FastifyReply, FastifyRequest } from "fastify";
import { CriarDisciplinaUseCase } from "../../../01-application/usecases/CriarDiciplinaUseCase";
import { DisciplinaDTO } from "../../../01-application/dtos/DisciplinaDTO";

export class DisciplinaController {
    
  /**
   * Controlador para operações relacionadas a Disciplina
   * @param criarDisciplinaUseCase Caso de uso para criar disciplina
   */
  constructor(private criarDisciplinaUseCase: CriarDisciplinaUseCase) {}

  async criarDisciplina(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { disciplina_codigo, ano_serie } = req.body as DisciplinaDTO;
      const disciplinaCriada = await this.criarDisciplinaUseCase.execute({
        disciplina_codigo,
        ano_serie,
      });
      reply.status(201).send(disciplinaCriada);
    } catch (erro: any) {
      reply.status(500).send({ error: erro.message });
    }
  }
}
