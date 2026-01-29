import { AtualizarConteudoUseCase } from "../../01-application/usecases/ConteudoUseCase/AtualizarConteudoUseCase";
import { ListarConteudosUseCase } from "../../01-application/usecases/ConteudoUseCase/ListarConteudosUseCase";
import {
  mockAIservice,
  mockConteudoGeradoRepository,
  mockDisciplinaRepository,
  mockRagBnccService,
  mockUnidadeRepository,
} from "../mocks/Mocks";
import { ConteudoGerado } from "../../02-domain/entities/ConteudoGerado";
import { randomUUID } from "node:crypto";
import { GerarUnidadeEConteudosUseCase } from "../../01-application/usecases/ConteudoUseCase/GerarUnidadeEConteudosUseCase";
import { Disciplina } from "../../02-domain/entities/Disciplina";
import { Unidade } from "../../02-domain/entities/Unidade";

describe("Conteudo Use Cases", () => {
  let atualizarConteudoUseCase: AtualizarConteudoUseCase;
  let listarConteudosUseCase: ListarConteudosUseCase;
  let gerarUnidadeEConteudosUseCase: GerarUnidadeEConteudosUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    atualizarConteudoUseCase = new AtualizarConteudoUseCase(
      mockConteudoGeradoRepository,
    );
    listarConteudosUseCase = new ListarConteudosUseCase(
      mockConteudoGeradoRepository,
    );
    gerarUnidadeEConteudosUseCase = new GerarUnidadeEConteudosUseCase(
      mockAIservice,
      mockUnidadeRepository,
      mockDisciplinaRepository,
      mockRagBnccService,
      mockConteudoGeradoRepository,
    );
  });

  describe("AtualizarConteudoUseCase", () => {
    it("Deve atualizar um conteúdo existente", async () => {
      const conteudoId = randomUUID();
      const unidadeId = randomUUID();
      const conteudoOriginal = new ConteudoGerado(
        conteudoId,
        unidadeId,
        "plano_de_aula",
        "Conteúdo original",
        new Date(),
      );
      const novoTexto = "Conteúdo atualizado com mais detalhes";

      mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(
        conteudoOriginal,
      );
      mockConteudoGeradoRepository.update.mockResolvedValue({
        ...conteudoOriginal,
        Conteudo: novoTexto,
      } as ConteudoGerado);

      const resultado = await atualizarConteudoUseCase.execute(
        conteudoId,
        novoTexto,
      );

      expect(mockConteudoGeradoRepository.buscarPorID).toHaveBeenCalledWith(
        conteudoId,
      );
      expect(mockConteudoGeradoRepository.update).toHaveBeenCalled();
      expect(resultado.Conteudo).toBe(novoTexto);
    });

    it("Deve lançar erro ao tentar atualizar conteúdo inexistente", async () => {
      const conteudoId = randomUUID();

      mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(null);

      await expect(
        atualizarConteudoUseCase.execute(conteudoId, "Novo conteúdo"),
      ).rejects.toThrow("Conteúdo não encontrado.");
    });

    it("Deve lançar erro ao tentar atualizar sem ID ou conteúdo", async () => {
      await expect(
        atualizarConteudoUseCase.execute("", "Novo conteúdo"),
      ).rejects.toThrow(
        "Dever ser informado o ID e o novo conteúdo para atualização.",
      );

      await expect(
        atualizarConteudoUseCase.execute(randomUUID(), ""),
      ).rejects.toThrow(
        "Dever ser informado o ID e o novo conteúdo para atualização.",
      );
    });

    it("Deve atualizar conteúdo mantendo os outros campos", async () => {
      const conteudoId = randomUUID();
      const unidadeId = randomUUID();
      const dataOriginal = new Date();
      const conteudoOriginal = new ConteudoGerado(
        conteudoId,
        unidadeId,
        "atividade",
        "Conteúdo original da atividade",
        dataOriginal,
      );
      const novoTexto = "Conteúdo da atividade totalmente revisado";

      const conteudoAtualizado = new ConteudoGerado(
        conteudoId,
        unidadeId,
        "atividade",
        novoTexto,
        dataOriginal,
      );

      mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(
        conteudoOriginal,
      );
      mockConteudoGeradoRepository.update.mockResolvedValue(conteudoAtualizado);

      const resultado = await atualizarConteudoUseCase.execute(
        conteudoId,
        novoTexto,
      );

      expect(resultado.ConteudoID).toBe(conteudoId);
      expect(resultado.UnidadeID).toBe(unidadeId);
      expect(resultado.Tipo).toBe("atividade");
      expect(resultado.Conteudo).toBe(novoTexto);
    });

    it("Deve atualizar diferentes tipos de conteúdo", async () => {
      const tipos: Array<"plano_de_aula" | "atividade" | "slide"> = [
        "plano_de_aula",
        "atividade",
        "slide",
      ];

      for (const tipo of tipos) {
        const conteudoId = randomUUID();
        const unidadeId = randomUUID();
        const conteudo = new ConteudoGerado(
          conteudoId,
          unidadeId,
          tipo,
          "Conteúdo original adequado para teste",
          new Date(),
        );
        const novoTexto = `Novo conteúdo para ${tipo}`;

        const conteudoAtualizado = new ConteudoGerado(
          conteudoId,
          unidadeId,
          tipo,
          novoTexto,
          new Date(),
        );

        mockConteudoGeradoRepository.buscarPorID.mockResolvedValue(conteudo);
        mockConteudoGeradoRepository.update.mockResolvedValue(
          conteudoAtualizado,
        );

        const resultado = await atualizarConteudoUseCase.execute(
          conteudoId,
          novoTexto,
        );

        expect(resultado.Tipo).toBe(tipo);
        expect(resultado.Conteudo).toBe(novoTexto);
      }
    });
  });

  describe("ListarConteudosUseCase", () => {
    it("Deve listar todos os conteúdos de uma unidade", async () => {
      const unidadeId = randomUUID();
      const conteudosMock = [
        new ConteudoGerado(
          randomUUID(),
          unidadeId,
          "plano_de_aula",
          "Este é um plano de aula completo",
          new Date(),
        ),
        new ConteudoGerado(
          randomUUID(),
          unidadeId,
          "atividade",
          "Esta é uma atividade completa",
          new Date(),
        ),
        new ConteudoGerado(
          randomUUID(),
          unidadeId,
          "slide",
          "Este é um conteúdo de slide",
          new Date(),
        ),
      ];

      mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue(
        conteudosMock,
      );

      const resultado = await listarConteudosUseCase.execute(unidadeId);

      expect(
        mockConteudoGeradoRepository.listarPorUnidade,
      ).toHaveBeenCalledWith(unidadeId);
      expect(resultado).toHaveLength(3);
      expect(resultado[0]).toHaveProperty("id");
      expect(resultado[0]).toHaveProperty("tipo");
      expect(resultado[0]).toHaveProperty("conteudo");
    });

    it("Deve retornar lista vazia quando não há conteúdos", async () => {
      const unidadeId = randomUUID();

      mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue([]);

      const resultado = await listarConteudosUseCase.execute(unidadeId);

      expect(resultado).toHaveLength(0);
    });

    it("Deve listar conteúdos com todas as propriedades corretas", async () => {
      const unidadeId = randomUUID();
      const dataEsperada = new Date();
      const conteudosMock = [
        new ConteudoGerado(
          randomUUID(),
          unidadeId,
          "plano_de_aula",
          "Plano detalhado de matemática",
          dataEsperada,
        ),
      ];

      mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue(
        conteudosMock,
      );

      const resultado = await listarConteudosUseCase.execute(unidadeId);

      expect(resultado[0].unidadeID).toBe(unidadeId);
      expect(resultado[0].tipo).toBe("plano_de_aula");
      expect(resultado[0].conteudo).toBe("Plano detalhado de matemática");
      expect(resultado[0].criadoEm).toBe(dataEsperada);
    });

    it("Deve listar apenas conteúdos da unidade especificada", async () => {
      const unidadeId1 = randomUUID();
      const conteudosMock = [
        new ConteudoGerado(
          randomUUID(),
          unidadeId1,
          "plano_de_aula",
          "Plano da unidade específica",
          new Date(),
        ),
        new ConteudoGerado(
          randomUUID(),
          unidadeId1,
          "atividade",
          "Atividade da unidade específica",
          new Date(),
        ),
      ];

      mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue(
        conteudosMock,
      );

      const resultado = await listarConteudosUseCase.execute(unidadeId1);

      expect(resultado.every((c) => c.unidadeID === unidadeId1)).toBe(true);
    });
  });

  describe("GerarConteudoEUnidadeUseCase", () => {
    it("Deve criar uma unidade com conteúdos gerados", async () => {
      const disciplinaId = randomUUID();
      const tema = "Matemática Basica";
      const tipos: Array<"plano_de_aula" | "atividade"> = ["plano_de_aula", "atividade"];
      const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
      const unidadeCriadaMock = new Unidade(
        randomUUID(),
        disciplinaId,
        tema,
        new Date(),
      );
      const planoDeAulaMock = {
        planoDeAula: "Plano de aula gerado para Matemática Basica",
        conteudoSlides: "Conteúdo de slides gerado para Matemática Basica",
      };
      const atividadeMock = "Atividade gerada para Matemática Basica";

      mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
      mockRagBnccService.consultarBNCC.mockResolvedValue("Contexto da BNCC");
      mockUnidadeRepository.criar.mockResolvedValue(unidadeCriadaMock);
      mockAIservice.gerarPlanoDeAula.mockResolvedValue(planoDeAulaMock);
      mockAIservice.gerarAtividade.mockResolvedValue(atividadeMock);
      mockConteudoGeradoRepository.criar.mockImplementation(
        async (conteudo: ConteudoGerado) => {
          // Retorna o conteúdo com a data de criação definida
          return new ConteudoGerado(
            randomUUID(),
            conteudo.UnidadeID,
            conteudo.Tipo as "plano_de_aula" | "atividade" | "slide",
            conteudo.Conteudo,
            new Date()
          );
        }
      );

      const result = await gerarUnidadeEConteudosUseCase.execute(
        disciplinaId,
        tema,
        tipos,
      );

      // Verificações essenciais
      expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(
        disciplinaId,
      );
      expect(mockUnidadeRepository.criar).toHaveBeenCalled();
      expect(mockAIservice.gerarPlanoDeAula).toHaveBeenCalled();
      expect(mockAIservice.gerarAtividade).toHaveBeenCalled();
      expect(result).toHaveProperty("unidade");
      expect(result).toHaveProperty("conteudos");
      expect(result.conteudos).toHaveLength(tipos.length);
      expect(result.conteudos.some((c) => c.tipo === "plano_de_aula")).toBe(
        true,
      );
      expect(result.conteudos.some((c) => c.tipo === "atividade")).toBe(true);
    });
  });
});
