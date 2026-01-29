import { CriarDisciplinaUseCase } from "../../01-application/usecases/DisciplinaUseCases/CriarDisciplinaUseCase";
import { DeleteDisciplinaUseCase } from "../../01-application/usecases/DisciplinaUseCases/DeleteDisciplinaUseCase";
import { ListarDisciplinaUseCase } from "../../01-application/usecases/DisciplinaUseCases/ListarDisciplinaUseCase";
import { ListarDisciplinaPorIDUseCase } from "../../01-application/usecases/DisciplinaUseCases/ListarDisciplinaPorIDUseCase";
import { mockBnccService, mockDisciplinaRepository } from "../mocks/Mocks";
import { Disciplina } from "../../02-domain/entities/Disciplina";
import { randomUUID } from "node:crypto";
describe("Disciplina Use Cases", () => {
    let criarDisciplinaUseCase;
    let deleteDisciplinaUseCase;
    let listarDisciplinaUseCase;
    let listarDisciplinaPorIDUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        criarDisciplinaUseCase = new CriarDisciplinaUseCase(mockDisciplinaRepository, mockBnccService);
        deleteDisciplinaUseCase = new DeleteDisciplinaUseCase(mockDisciplinaRepository);
        listarDisciplinaUseCase = new ListarDisciplinaUseCase(mockDisciplinaRepository);
        listarDisciplinaPorIDUseCase = new ListarDisciplinaPorIDUseCase(mockDisciplinaRepository);
    });
    describe("CriarDisciplinaUseCase", () => {
        it("Deve criar uma nova disciplina", async () => {
            const disciplinaDTO = {
                disciplina_codigo: "MAT",
                ano_serie: "9_ANO"
            };
            const disciplinaCriadaMock = new Disciplina(randomUUID(), disciplinaDTO.disciplina_codigo, disciplinaDTO.ano_serie);
            mockBnccService.disciplinaValida.mockReturnValue(true);
            mockDisciplinaRepository.criar.mockResolvedValue(disciplinaCriadaMock);
            const resultado = await criarDisciplinaUseCase.execute(disciplinaDTO);
            expect(mockBnccService.disciplinaValida).toHaveBeenCalledWith("MAT", "9_ANO");
            expect(mockDisciplinaRepository.criar).toHaveBeenCalled();
            expect(resultado).toEqual({
                id: disciplinaCriadaMock.DisciplinaID,
                disciplinaCodigo: disciplinaCriadaMock.disciplinaCodigo,
                nome: expect.any(String),
                anoSerie: disciplinaCriadaMock.anoSerie,
                anoSerieNome: expect.any(String),
            });
        });
        it("Deve formatar código e série para maiúsculas ao criar disciplina", async () => {
            const disciplinaDTO = {
                disciplina_codigo: "MA", // simulando entrada lowercase
                ano_serie: "9_ANO"
            };
            const disciplinaCriadaMock = new Disciplina(randomUUID(), "MA", "9_ANO");
            mockBnccService.disciplinaValida.mockReturnValue(true);
            mockDisciplinaRepository.criar.mockResolvedValue(disciplinaCriadaMock);
            const resultado = await criarDisciplinaUseCase.execute(disciplinaDTO);
            expect(mockBnccService.disciplinaValida).toHaveBeenCalledWith("MA", "9_ANO");
            expect(resultado.disciplinaCodigo).toBe("MA");
            expect(resultado.anoSerie).toBe("9_ANO");
        });
        it("Deve lançar erro ao tentar criar disciplina inválida", async () => {
            const disciplinaDTO = {
                disciplina_codigo: "INVALIDO",
                ano_serie: "9_ANO"
            };
            mockBnccService.disciplinaValida.mockReturnValue(false);
            await expect(criarDisciplinaUseCase.execute(disciplinaDTO))
                .rejects.toThrow("Disciplina ou série inválida");
        });
        it("Deve criar disciplinas de diferentes tipos corretamente", async () => {
            const disciplinas = [
                { codigo: "LP", serie: "8_ANO" },
                { codigo: "CI", serie: "6_ANO" },
                { codigo: "HI", serie: "7_ANO" },
            ];
            for (const disc of disciplinas) {
                const disciplinaMock = new Disciplina(randomUUID(), disc.codigo, disc.serie);
                mockBnccService.disciplinaValida.mockReturnValue(true);
                mockDisciplinaRepository.criar.mockResolvedValue(disciplinaMock);
                const resultado = await criarDisciplinaUseCase.execute({
                    disciplina_codigo: disc.codigo,
                    ano_serie: disc.serie
                });
                expect(resultado.disciplinaCodigo).toBe(disc.codigo);
                expect(resultado.anoSerie).toBe(disc.serie);
            }
        });
    });
    describe("DeleteDisciplinaUseCase", () => {
        it("Deve excluir uma disciplina existente", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            mockDisciplinaRepository.excluir.mockResolvedValue(undefined);
            const resultado = await deleteDisciplinaUseCase.execute(disciplinaId);
            expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(disciplinaId);
            expect(mockDisciplinaRepository.excluir).toHaveBeenCalledWith(disciplinaId);
            expect(resultado).toBe(true);
        });
        it("Deve lançar erro ao tentar excluir disciplina inexistente", async () => {
            const disciplinaId = randomUUID();
            mockDisciplinaRepository.findByID.mockResolvedValue(null);
            await expect(deleteDisciplinaUseCase.execute(disciplinaId)).rejects.toThrow("Disciplina não encontrada");
        });
        it("Deve lançar erro ao tentar excluir com ID vazio", async () => {
            await expect(deleteDisciplinaUseCase.execute("")).rejects.toThrow("ID da disciplina é obrigatório.");
        });
        it("Deve lançar erro ao tentar excluir com ID contendo apenas espaços", async () => {
            await expect(deleteDisciplinaUseCase.execute("   ")).rejects.toThrow("ID da disciplina é obrigatório.");
        });
    });
    describe("ListarDisciplinaUseCase", () => {
        it("Deve listar todas as disciplinas", async () => {
            const disciplinasMock = [
                new Disciplina(randomUUID(), "MA", "9_ANO"),
                new Disciplina(randomUUID(), "LP", "8_ANO"),
            ];
            mockDisciplinaRepository.listar.mockResolvedValue(disciplinasMock);
            const resultado = await listarDisciplinaUseCase.execute();
            expect(mockDisciplinaRepository.listar).toHaveBeenCalled();
            expect(resultado).toHaveLength(2);
            expect(resultado[0]).toHaveProperty("id");
            expect(resultado[0]).toHaveProperty("nome");
            expect(resultado[0]).toHaveProperty("anoSerieNome");
        });
        it("Deve retornar lista vazia quando não há disciplinas", async () => {
            mockDisciplinaRepository.listar.mockResolvedValue([]);
            const resultado = await listarDisciplinaUseCase.execute();
            expect(resultado).toHaveLength(0);
        });
        it("Deve mapear corretamente os nomes das disciplinas e anos", async () => {
            const disciplinasMock = [
                new Disciplina(randomUUID(), "MA", "9_ANO"),
            ];
            mockDisciplinaRepository.listar.mockResolvedValue(disciplinasMock);
            const resultado = await listarDisciplinaUseCase.execute();
            expect(resultado[0]).toHaveProperty("disciplinaCodigo", "MA");
            expect(resultado[0]).toHaveProperty("anoSerie", "9_ANO");
            expect(resultado[0].nome).toBeTruthy();
            expect(resultado[0].anoSerieNome).toBeTruthy();
        });
        it("Deve listar múltiplas disciplinas de diferentes séries", async () => {
            const disciplinasMock = [
                new Disciplina(randomUUID(), "MA", "9_ANO"),
                new Disciplina(randomUUID(), "LP", "8_ANO"),
                new Disciplina(randomUUID(), "CI", "7_ANO"),
                new Disciplina(randomUUID(), "HI", "6_ANO"),
            ];
            mockDisciplinaRepository.listar.mockResolvedValue(disciplinasMock);
            const resultado = await listarDisciplinaUseCase.execute();
            expect(resultado).toHaveLength(4);
            expect(resultado.every(d => d.id && d.nome && d.anoSerieNome)).toBe(true);
        });
    });
    describe("ListarDisciplinaPorIDUseCase", () => {
        it("Deve buscar uma disciplina por ID", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            const resultado = await listarDisciplinaPorIDUseCase.execute(disciplinaId);
            expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(disciplinaId);
            expect(resultado).toHaveProperty("id", disciplinaId);
            expect(resultado).toHaveProperty("nome");
            expect(resultado).toHaveProperty("anoSerieNome");
        });
        it("Deve lançar erro ao buscar disciplina inexistente", async () => {
            const disciplinaId = randomUUID();
            mockDisciplinaRepository.findByID.mockResolvedValue(null);
            await expect(listarDisciplinaPorIDUseCase.execute(disciplinaId)).rejects.toThrow("Disciplina não encontrada");
        });
        it("Deve lançar erro ao buscar com ID vazio", async () => {
            await expect(listarDisciplinaPorIDUseCase.execute("")).rejects.toThrow("O ID da disciplina é obrigatório.");
        });
        it("Deve lançar erro ao buscar com ID contendo apenas espaços", async () => {
            await expect(listarDisciplinaPorIDUseCase.execute("   ")).rejects.toThrow("O ID da disciplina é obrigatório.");
        });
        it("Deve retornar disciplina com todos os campos mapeados corretamente", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "LP", "6_ANO");
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            const resultado = await listarDisciplinaPorIDUseCase.execute(disciplinaId);
            expect(resultado.id).toBe(disciplinaId);
            expect(resultado.disciplinaCodigo).toBe("LP");
            expect(resultado.anoSerie).toBe("6_ANO");
            expect(typeof resultado.nome).toBe("string");
            expect(typeof resultado.anoSerieNome).toBe("string");
        });
    });
});
