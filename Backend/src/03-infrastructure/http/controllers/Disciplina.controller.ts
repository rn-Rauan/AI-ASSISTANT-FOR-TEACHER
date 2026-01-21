import { FastifyReply, FastifyRequest } from "fastify";
import { CriarDisciplinaUseCase } from "../../../01-application/usecases/DisciplinaUseCases/CriarDisciplinaUseCase";
import { DisciplinaDTO } from "../../../01-application/dtos/DisciplinaDTOs/DisciplinaDTO";
import { DeleteDisciplinaUseCase } from "../../../01-application/usecases/DisciplinaUseCases/DeleteDisciplinaUseCase";
import { ListarDisciplinaUseCase } from "../../../01-application/usecases/DisciplinaUseCases/ListarDisciplinaUseCase";
import { ListarDisciplinaPorIDUseCase } from "../../../01-application/usecases/DisciplinaUseCases/ListarDisciplinaPorIDUseCase";
import { SugerirTemasUseCase } from "../../../01-application/usecases/TemasUseCase/SugerirTemasUseCase";

export class DisciplinaController {
  /**
   * Controlador para operações relacionadas a Disciplina
   * @param criarDisciplinaUseCase Caso de uso para criar disciplina
  */
  constructor(
    private criarDisciplinaUseCase: CriarDisciplinaUseCase,
    private listarDisciplinaUseCase: ListarDisciplinaUseCase,
    private deleteDisciplinaUseCase: DeleteDisciplinaUseCase,
    private listarDisciplinaPorIDUseCase: ListarDisciplinaPorIDUseCase,
    private sugerirTemasUseCase: SugerirTemasUseCase
  ) { }
  /**
   * 
   * @param req Requisição HTTP contendo os dados da disciplina
   * @param reply Resposta HTTP com a disciplina criada
   */
  async criarDisciplina(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { disciplina_codigo, ano_serie } = req.body as DisciplinaDTO;
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
    } catch (erro: unknown) {
      const message = erro instanceof Error ? erro.message : "Erro desconhecido";
      return reply.status(500).send({ message: "Erro ao criar disciplina", error: message });
    }
  }/**
   * 
   * @param _req Requisição HTTP vazia
   * @param reply Resposta HTTP com a lista de disciplinas
   */
  async listarDisciplinas(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const disciplinas = await this.listarDisciplinaUseCase.execute();
      return reply.status(200).send(disciplinas);
    } catch (erro: unknown) {
      const message = erro instanceof Error ? erro.message : "Erro desconhecido";
      return reply.status(500).send({ message: "Erro ao listar disciplinas", error: message });
    }
  }
  /**
   * 
   * @param req Requisição HTTP contendo o ID da disciplina
   * @param reply Resposta HTTP com a mensagem de sucesso
   */
  async deletarDisciplina(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        return reply.status(400).send({ message: "ID da disciplina é obrigatório." });
      }
      await this.deleteDisciplinaUseCase.execute(id);
      return reply.status(200).send({ message: "Disciplina deletada com sucesso" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({ message: "Erro ao deletar disciplina", error: message });
    }
  }
  /**
   * 
   * @param req Requisição HTTP contendo o ID da disciplina
   * @param reply Resposta HTTP com a disciplina encontrada
   */
  async obterDisciplinaPorID(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      if (!id) {
        return reply.status(400).send({ message: "ID da disciplina é obrigatório." });
      }
      const disciplina = await this.listarDisciplinaPorIDUseCase.execute(id);
      if (!disciplina) {
        return reply.status(404).send({ message: "Disciplina não encontrada." });
      }
      return reply.status(200).send(disciplina);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({ message: "Erro ao obter disciplina por ID", error: message });
    }
  }
}