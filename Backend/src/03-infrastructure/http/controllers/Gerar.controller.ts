import { FastifyReply, FastifyRequest } from "fastify";
import { GerarConteudosUseCase } from "../../../01-application/usecases/ConteudoUseCase/GerarConteudosUseCase";
import { ListarConteudosUseCase } from "../../../01-application/usecases/ConteudoUseCase/ListarConteudosUseCase";

export class GerarController {
  /**
   * Controlador para operações de geração de conteúdo
   * @param gerarConteudosUseCase Caso de uso para criar unidade + gerar conteúdos 
   * @param listarConteudosUseCase Caso de uso para listar conteúdos de uma unidade
   */
  constructor(
    private gerarConteudosUseCase: GerarConteudosUseCase,
    private listarConteudosUseCase: ListarConteudosUseCase
  ) { }

  /**
   * Gera múltiplos conteúdos para uma disciplina e cria a unidade automaticamente
   * cria unidade + conteúdos de uma vez
   * @param req Requisição HTTP contendo disciplina_id, tema, observações e tipos
   * @param reply Resposta HTTP com a unidade e conteúdos gerados
   */
  async gerarConteudos(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { disciplina_id, tema, observacoes, tipos } = req.body as {
        disciplina_id: string;
        tema: string;
        observacoes?: string;
        tipos: string[];
      };

      if (!disciplina_id || disciplina_id.trim().length == 0) {
        return reply.status(400).send({
          message: "Campo obrigatório: disciplina_id",
        });
      }

      if (!tema || tema.trim().length < 2) {
        return reply.status(400).send({
          message: "Campo obrigatório: tema (mínimo 2 caracteres)",
        });
      }

      if (!tipos || tipos.length == 0) {
        return reply.status(400).send({
          message: "Campo obrigatório: tipos (array com ao menos um tipo: plano_de_aula, atividade)",
        });
      }

      const resultado = await this.gerarConteudosUseCase.execute(
        disciplina_id,
        tema,
        tipos,
        observacoes
      );

      return reply.status(201).send({
        message: `Unidade criada com ${resultado.conteudos.length} conteúdo(s)`,
        ...resultado,
      });
    } catch (error: any) {
        return reply.status(500).send({
        message: "Erro ao gerar conteúdos",
        error: error.message,
      });
    }
  }

  /**
   * Lista todos os conteúdos de uma unidade
   * @param req Requisição HTTP contendo o ID da unidade
   * @param reply Resposta HTTP com os conteúdos
   */
  async listarConteudos(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { unidade_id } = req.query as { unidade_id: string };

      if (!unidade_id) {
        return reply.status(400).send({
          message: "Campo obrigatório: unidade_id",
        });
      }

      const conteudos = await this.listarConteudosUseCase.execute(unidade_id);

      return reply.status(200).send(conteudos);
    } catch (error: any) {
      return reply.status(500).send({
        message: "Erro ao listar conteúdos",
        error: error.message,
      });
    }
  }
}
