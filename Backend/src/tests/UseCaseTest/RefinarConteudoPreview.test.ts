import { RefinarConteudoPreviewUseCase } from "../../01-application/usecases/ConteudoUseCase/RefinarConteudoPreviewUseCase";
import {
  mockAIservice,
  mockConteudoGeradoRepository,
} from "../mocks/Mocks";
import { ConteudoGerado } from "../../02-domain/entities/ConteudoGerado";
import { randomUUID } from "node:crypto";

describe("RefinarConteudoPreviewUseCase", () => {
  let refinarConteudoPreviewUseCase: RefinarConteudoPreviewUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    refinarConteudoPreviewUseCase = new RefinarConteudoPreviewUseCase(
      mockConteudoGeradoRepository,
      mockAIservice
    );
  });

  it("Deve gerar prévia de refinamento para plano de aula", async () => {
    const conteudoId = randomUUID();
    const unidadeId = randomUUID();
    const conteudoOriginal = new ConteudoGerado(
      conteudoId,
      unidadeId,
      "plano_de_aula",
      "Plano original",
      new Date()
    );
    const instrucao = "Melhorar introdução";
    const conteudoRefinadoTexto = "Plano refinado";

    mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(conteudoOriginal);
    mockAIservice.refinarPlanoDeAula.mockResolvedValue({
      conteudo: conteudoRefinadoTexto,
      mensagemIA: "Refinado com sucesso"
    });

    const resultado = await refinarConteudoPreviewUseCase.execute(conteudoId, instrucao);

    expect(mockConteudoGeradoRepository.buscarPorID).toHaveBeenCalledWith(conteudoId);
    expect(mockAIservice.refinarPlanoDeAula).toHaveBeenCalledWith("Plano original", instrucao);
    expect(resultado.conteudo).toBe(conteudoRefinadoTexto);
    // Não deve chamar update
    expect(mockConteudoGeradoRepository.update).not.toHaveBeenCalled();
  });

  it("Deve lançar erro se conteúdo não encontrado", async () => {
    mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(null);
    await expect(refinarConteudoPreviewUseCase.execute("id-inexistente", "instrucao")).rejects.toThrow("Conteúdo com ID id-inexistente não encontrado");
  });

  it("Deve chamar refinarAtividade para tipo atividade", async () => {
    const conteudoId = randomUUID();
    const unidadeId = randomUUID();
    const conteudoOriginal = new ConteudoGerado(
      conteudoId,
      unidadeId,
      "atividade",
      "Atividade original",
      new Date()
    );
    const instrucao = "Mais difícil";

    mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(conteudoOriginal);
    mockAIservice.refinarAtividade.mockResolvedValue({
      conteudo: "Atividade difícil",
      mensagemIA: "OK"
    });

    await refinarConteudoPreviewUseCase.execute(conteudoId, instrucao);
    expect(mockAIservice.refinarAtividade).toHaveBeenCalledWith("Atividade original", instrucao);
  });
});
