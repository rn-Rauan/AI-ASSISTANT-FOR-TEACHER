import { ListarUnidadesUseCase } from "../../01-application/usecases/UnidadeUseCase/ListarUnidadesUseCase";
import { mockUnidadeRepository, mockDisciplinaRepository } from "../mocks/Mocks";
import { Unidade } from "../../02-domain/entities/Unidade";
import { Disciplina } from "../../02-domain/entities/Disciplina";
import { randomUUID } from "node:crypto";

describe("ListarUnidadesUseCase", () => {
    let listarUnidadesUseCase: ListarUnidadesUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        listarUnidadesUseCase = new ListarUnidadesUseCase(mockUnidadeRepository, mockDisciplinaRepository);
    });

    it("Deve listar todas as unidades de uma disciplina", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
        const unidadesMock = [
            new Unidade(randomUUID(), disciplinaId, "ÁLGEBRA", new Date()),
            new Unidade(randomUUID(), disciplinaId, "GEOMETRIA", new Date()),
            new Unidade(randomUUID(), disciplinaId, "TRIGONOMETRIA", new Date()),
        ];

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockUnidadeRepository.listar.mockResolvedValue(unidadesMock);

        const resultado = await listarUnidadesUseCase.execute(disciplinaId);

        expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(disciplinaId);
        expect(mockUnidadeRepository.listar).toHaveBeenCalledWith(disciplinaId);
        expect(resultado).toHaveLength(3);
        expect(resultado.every(u => u.disciplinaID === disciplinaId)).toBe(true);
        expect(resultado.every(u => Array.isArray(u.conteudos))).toBe(true);
    });

    it("Deve lançar erro quando ID da disciplina não é fornecido", async () => {
        await expect(listarUnidadesUseCase.execute(undefined)).rejects.toThrow(
            "O ID da disciplina é obrigatório para listar as unidades."
        );
    });

    it("Deve lançar erro quando disciplina não existe", async () => {
        const disciplinaId = randomUUID();

        mockDisciplinaRepository.findByID.mockResolvedValue(null);

        await expect(listarUnidadesUseCase.execute(disciplinaId)).rejects.toThrow(
            "Disciplina não encontrada."
        );
    });

    it("Deve retornar lista vazia quando disciplina não tem unidades", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "LP", "8_ANO");

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockUnidadeRepository.listar.mockResolvedValue([]);

        const resultado = await listarUnidadesUseCase.execute(disciplinaId);

        expect(resultado).toHaveLength(0);
    });

    it("Deve retornar unidades com todos os campos mapeados", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "CI", "7_ANO");
        const dataEsperada = new Date();
        const unidadeId = randomUUID();
        const unidadesMock = [
            new Unidade(unidadeId, disciplinaId, "ECOLOGIA", dataEsperada),
        ];

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockUnidadeRepository.listar.mockResolvedValue(unidadesMock);

        const resultado = await listarUnidadesUseCase.execute(disciplinaId);

        expect(resultado[0].id).toBe(unidadeId);
        expect(resultado[0].disciplinaID).toBe(disciplinaId);
        expect(resultado[0].tema).toBe("ECOLOGIA");
        expect(resultado[0].criadoEm).toBe(dataEsperada);
    });

    it("Deve listar unidades de diferentes disciplinas separadamente", async () => {
        const disciplinaId1 = randomUUID();
        const disciplinaId2 = randomUUID();
        const disciplinaMock1 = new Disciplina(disciplinaId1, "MA", "9_ANO");
        const disciplinaMock2 = new Disciplina(disciplinaId2, "LP", "8_ANO");
        
        const unidadesMock1 = [
            new Unidade(randomUUID(), disciplinaId1, "ÁLGEBRA", new Date()),
        ];
        const unidadesMock2 = [
            new Unidade(randomUUID(), disciplinaId2, "LITERATURA", new Date()),
        ];

        // Primeiro teste disciplina 1
        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock1);
        mockUnidadeRepository.listar.mockResolvedValue(unidadesMock1);

        const resultado1 = await listarUnidadesUseCase.execute(disciplinaId1);
        expect(resultado1[0].disciplinaID).toBe(disciplinaId1);

        // Depois teste disciplina 2
        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock2);
        mockUnidadeRepository.listar.mockResolvedValue(unidadesMock2);

        const resultado2 = await listarUnidadesUseCase.execute(disciplinaId2);
        expect(resultado2[0].disciplinaID).toBe(disciplinaId2);
    });

    it("Deve listar múltiplas unidades ordenadamente", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "HI", "6_ANO");
        const unidadesMock = [
            new Unidade(randomUUID(), disciplinaId, "PRÉ-HISTÓRIA", new Date("2024-01-01")),
            new Unidade(randomUUID(), disciplinaId, "IDADE ANTIGA", new Date("2024-01-02")),
            new Unidade(randomUUID(), disciplinaId, "IDADE MÉDIA", new Date("2024-01-03")),
            new Unidade(randomUUID(), disciplinaId, "IDADE MODERNA", new Date("2024-01-04")),
            new Unidade(randomUUID(), disciplinaId, "IDADE CONTEMPORÂNEA", new Date("2024-01-05")),
        ];

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockUnidadeRepository.listar.mockResolvedValue(unidadesMock);

        const resultado = await listarUnidadesUseCase.execute(disciplinaId);

        expect(resultado).toHaveLength(5);
        expect(resultado.every(u => u.id && u.tema && u.criadoEm)).toBe(true);
    });
});
