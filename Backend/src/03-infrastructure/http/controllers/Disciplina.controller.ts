import { FastifyReply, FastifyRequest } from "fastify";
import { CriarDisciplinaUseCase } from "../../../01-application/usecases/CriarDiciplinaUseCase";
import { DisciplinaDTO } from "../../../01-application/dtos/DisciplinaDTO";
import { ListarDisciplinaUseCase } from "../../../01-application/usecases/ListarDiciplinaUsecase";
import { DeleteDisciplinaUseCase } from "../../../01-application/usecases/DeleteDisciplinaUseCase";


// PADRÕES DE RESPOSTA DO SISTEMA:
// --- ERROS DO CLIENTE (4XX) ---
// - 400: Dados inválidos (erro de validação, campos obrigatórios, formato de JSON incorreto).
// - 404: Recurso não encontrado (ID inexistente no banco para disciplina, usuário, etc).
// - 405: Método não permitido (ex: tentou fazer um POST em uma rota que só aceita GET).
// - 408: Timeout do cliente (a requisição demorou demais para ser enviada).
// - 409: Conflito de regra de negócio (ex: tentar cadastrar e-mail já existente ou deletar algo com dependências).
// - 422: Entidade improcessável (erro de semântica, ex: data de fim é menor que data de início).
// - 429: Limite de requisições excedido (rate limit).

// --- ERROS DO SERVIDOR (5XX) ---
// - 500: Erro interno inesperado (bugs de código, exceções não capturadas, crash do servidor).
// - 502: Bad Gateway (o servidor recebeu uma resposta inválida do banco ou de uma API externa).
// - 503: Serviço indisponível (servidor em manutenção ou sobrecarregado).
// - 504: Gateway Timeout (o banco de dados ou API externa demorou demais para responder).

// --- DICAS DE USO ---
// - Use 400 para erros que o usuário pode corrigir (ex: preencher o campo nome).
// - Use 404 estritamente para quando o ID não existe.
// - Use 409 para violações de banco que não são culpa do formato dos dados (ex: duplicidade).
// - Use 500 apenas se você não souber o que aconteceu (o "último recurso").


export class DisciplinaController {
    
  /**
   * Controlador para operações relacionadas a Disciplina
   * @param criarDisciplinaUseCase Caso de uso para criar disciplina
   */
  constructor(private criarDisciplinaUseCase: CriarDisciplinaUseCase, private listarDisciplinaUseCase: ListarDisciplinaUseCase, private deleteDisciplinaUseCase: DeleteDisciplinaUseCase) {}

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
  async listarDisciplinas(_req: FastifyRequest, reply: FastifyReply) {
    try {
      const disciplinas = await this.listarDisciplinaUseCase.execute();
      reply.status(200).send(disciplinas);
    } catch (erro: any) {
      reply.status(500).send({ error: erro.message });
    }
  }
  async deletarDisciplina(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      await this.deleteDisciplinaUseCase.execute(id);
      reply.status(200).send({ message: "Disciplina deletada com sucesso" });
    }catch(error: any) {
      reply.status(500).send({ error: error.message });
    }
  }
}
