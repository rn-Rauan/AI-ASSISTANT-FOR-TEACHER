import { FastifyReply, FastifyRequest } from "fastify";
import { GerarUnidadeEConteudosUseCase } from "../../../01-application/usecases/ConteudoUseCase/GerarUnidadeEConteudosUseCase";
import { ListarConteudosUseCase } from "../../../01-application/usecases/ConteudoUseCase/ListarConteudosUseCase";
import { AtualizarConteudoUseCase } from "../../../01-application/usecases/ConteudoUseCase/AtualizarConteudoUseCase";
import { RefinarConteudoUseCase } from "../../../01-application/usecases/ConteudoUseCase/RefinarConteudoUseCase";

export class GerarController {
  /**
   * Controlador para operações de geração de conteúdo
   * @param gerarUnidadeEConteudosUseCase Caso de uso para criar unidade + gerar conteúdos
   * @param listarConteudosUseCase Caso de uso para listar conteúdos de uma unidade
   * @param atualizarConteudoUseCase Caso de uso para atualizar um conteúdo existente
   * @param refinarConteudoUseCase Caso de uso para refinar conteúdos existentes
   * */
  constructor(
    private gerarUnidadeEConteudosUseCase: GerarUnidadeEConteudosUseCase,
    private listarConteudosUseCase: ListarConteudosUseCase,
    private atualizarConteudoUseCase: AtualizarConteudoUseCase,
    private refinarConteudoUseCase: RefinarConteudoUseCase,
  ) {}

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
          message:
            "Campo obrigatório: tipos (array com ao menos um tipo: plano_de_aula, atividade)",
        });
      }

      const resultado = await this.gerarUnidadeEConteudosUseCase.execute(
        disciplina_id,
        tema,
        tipos,
        observacoes,
      );

      return reply.status(201).send({
        message: `Unidade criada com ${resultado.conteudos.length} conteúdo(s)`,
        ...resultado,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({
        message: "Erro ao gerar conteúdos",
        error: message,
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
      const { id } = req.params as { id: string };

      if (!id) {
        return reply.status(400).send({
          message: "Campo obrigatório: id",
        });
      }

      const conteudos = await this.listarConteudosUseCase.execute(id);

      return reply.status(200).send(conteudos);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({
        message: "Erro ao listar conteúdos",
        error: message,
      });
    }
  }

  /**
   * Atualiza um conteúdo existente
   * @param req Requisição HTTP contendo o ID do conteúdo e o novo conteúdo
   * @param reply Resposta HTTP com o conteúdo atualizado
   */
  async atualizarConteudo(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const { conteudo } = req.body as { conteudo: string };

      if (!id || !conteudo) {
        return reply.status(400).send({
          message: "Campo obrigatório: id e conteudo",
        });
      }

      const conteudoAtualizado = await this.atualizarConteudoUseCase.execute(
        id,
        conteudo,
      );

      return reply.status(200).send({
        message: "Conteúdo atualizado com sucesso",
        conteudoAtualizado,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({
        message: "Erro ao atualizar conteúdo",
        error: message,
      });
    }
  }

  /**
   * Refina múltiplos conteúdos de uma unidade com base em instrução
   * @param req Requisição HTTP contendo unidade_id, conteudos_ids e instrucao
   * @param reply Resposta HTTP com os conteúdos refinados
   */
  async refinarConteudo(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { unidade_id, conteudos_ids, instrucao } = req.body as {
        unidade_id: string;
        conteudos_ids: string[];
        instrucao: string;
      };

      if (!unidade_id || unidade_id.trim().length === 0) {
        return reply.status(400).send({
          message: "Campo obrigatório: unidade_id",
        });
      }

      if (!conteudos_ids || conteudos_ids.length === 0) {
        return reply.status(400).send({
          message: "Campo obrigatório: conteudos_ids (array com ao menos um ID de conteúdo)",
        });
      }

      if (!instrucao || instrucao.trim().length < 2) {
        return reply.status(400).send({
          message: "Campo obrigatório: instrucao (mínimo 2 caracteres)",
        });
      }

      const conteudosRefinados = await this.refinarConteudoUseCase.execute(
        unidade_id,
        conteudos_ids,
        instrucao,
      );

      return reply.status(200).send({
        message: `${conteudosRefinados.length} conteúdo(s) refinado(s) com sucesso`,
        conteudos: conteudosRefinados,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Erro desconhecido";
      return reply.status(500).send({
        message: "Erro ao refinar conteúdos",
        error: message,
      });
    }
  }
}
