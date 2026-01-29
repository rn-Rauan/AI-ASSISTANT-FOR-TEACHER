import { BuscarUnidadePorIDUseCase } from "../../01-application/usecases/UnidadeUseCase/BuscarUnidadePorIDUseCase";
import { CriarUnidadeUseCase } from "../../01-application/usecases/UnidadeUseCase/CriarUnidadeUseCase";
import { DeleteUnidadeUseCase } from "../../01-application/usecases/UnidadeUseCase/DeleteUnidadeUseCase";
import { mockUnidadeRepository, mockDisciplinaRepository, mockConteudoGeradoRepository } from "../mocks/Mocks";
import { Unidade } from "../../02-domain/entities/Unidade";
import { Disciplina } from "../../02-domain/entities/Disciplina";
import { randomUUID } from "node:crypto";
import { ConteudoGerado } from "../../02-domain/entities/ConteudoGerado";
describe("Unidade Use Cases", () => {
    let buscarUnidadePorIDUseCase;
    let criarUnidadeUseCase;
    let deleteUnidadeUseCase;
    beforeEach(() => {
        jest.clearAllMocks();
        buscarUnidadePorIDUseCase = new BuscarUnidadePorIDUseCase(mockUnidadeRepository, mockConteudoGeradoRepository);
        criarUnidadeUseCase = new CriarUnidadeUseCase(mockUnidadeRepository, mockDisciplinaRepository);
        deleteUnidadeUseCase = new DeleteUnidadeUseCase(mockUnidadeRepository);
    });
    describe("CriarUnidadeUseCase", () => {
        it("Deve criar uma nova unidade", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "MAT", "9_ANO");
            const unidadeDTO = {
                disciplina_id: disciplinaId,
                tema: "Equações do Segundo Grau",
            };
            const unidadeCriadaMock = new Unidade(randomUUID(), disciplinaId, "EQUAÇÕES DO SEGUNDO GRAU", new Date());
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            mockUnidadeRepository.criar.mockResolvedValue(unidadeCriadaMock);
            const resultado = await criarUnidadeUseCase.execute(unidadeDTO);
            expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(disciplinaId);
            expect(mockUnidadeRepository.criar).toHaveBeenCalled();
            expect(resultado.UnidadeID).toBe(unidadeCriadaMock.UnidadeID);
        });
        it("Deve lançar erro ao criar unidade com disciplina inexistente", async () => {
            const unidadeDTO = {
                disciplina_id: randomUUID(),
                tema: "Equações do Segundo Grau",
            };
            mockDisciplinaRepository.findByID.mockResolvedValue(null);
            await expect(criarUnidadeUseCase.execute(unidadeDTO)).rejects.toThrow("Disciplina não encontrada");
        });
        it("Deve formatar o tema para maiúsculas ao criar unidade", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
            const unidadeDTO = {
                disciplina_id: disciplinaId,
                tema: "geometria espacial",
            };
            const unidadeCriadaMock = new Unidade(randomUUID(), disciplinaId, "GEOMETRIA ESPACIAL", new Date());
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            mockUnidadeRepository.criar.mockResolvedValue(unidadeCriadaMock);
            const resultado = await criarUnidadeUseCase.execute(unidadeDTO);
            expect(resultado.Tema).toBe("GEOMETRIA ESPACIAL");
        });
        it("Deve criar unidades com temas diferentes para mesma disciplina", async () => {
            const disciplinaId = randomUUID();
            const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
            const temas = ["Álgebra", "Geometria", "Trigonometria"];
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            for (const tema of temas) {
                const unidadeMock = new Unidade(randomUUID(), disciplinaId, tema.toUpperCase(), new Date());
                mockUnidadeRepository.criar.mockResolvedValue(unidadeMock);
                const resultado = await criarUnidadeUseCase.execute({
                    disciplina_id: disciplinaId,
                    tema: tema
                });
                expect(resultado.DisciplinaID).toBe(disciplinaId);
            }
        });
    });
    describe("BuscarUnidadePorIDUseCase", () => {
        it("Deve buscar uma unidade por ID com seus conteúdos", async () => {
            const unidadeId = randomUUID();
            const disciplinaId = randomUUID();
            const unidadeMock = new Unidade(unidadeId, disciplinaId, "TRIGONOMETRIA", new Date());
            const conteudosMock = [
                new ConteudoGerado(randomUUID(), unidadeId, "plano_de_aula", "Conteúdo do plano", new Date()),
            ];
            mockUnidadeRepository.findByID.mockResolvedValue(unidadeMock);
            mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue(conteudosMock);
            const resultado = await buscarUnidadePorIDUseCase.execute(unidadeId);
            expect(mockUnidadeRepository.findByID).toHaveBeenCalledWith(unidadeId);
            expect(mockConteudoGeradoRepository.listarPorUnidade).toHaveBeenCalledWith(unidadeId);
            expect(resultado).not.toBeNull();
            expect(resultado?.id).toBe(unidadeId);
            expect(resultado?.conteudos).toHaveLength(1);
        });
        it("Deve retornar null ao buscar unidade inexistente", async () => {
            const unidadeId = randomUUID();
            mockUnidadeRepository.findByID.mockResolvedValue(null);
            const resultado = await buscarUnidadePorIDUseCase.execute(unidadeId);
            expect(resultado).toBeNull();
        });
        it("Deve lançar erro ao buscar com ID vazio", async () => {
            await expect(buscarUnidadePorIDUseCase.execute("")).rejects.toThrow("ID da unidade é obrigatório.");
        });
        it("Deve buscar unidade com múltiplos conteúdos", async () => {
            const unidadeId = randomUUID();
            const disciplinaId = randomUUID();
            const unidadeMock = new Unidade(unidadeId, disciplinaId, "FÍSICA MODERNA", new Date());
            const conteudosMock = [
                new ConteudoGerado(randomUUID(), unidadeId, "plano_de_aula", "Plano de aula completo", new Date()),
                new ConteudoGerado(randomUUID(), unidadeId, "atividade", "Atividade prática sobre física", new Date()),
                new ConteudoGerado(randomUUID(), unidadeId, "slide", "Apresentação sobre física moderna", new Date()),
            ];
            mockUnidadeRepository.findByID.mockResolvedValue(unidadeMock);
            mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue(conteudosMock);
            const resultado = await buscarUnidadePorIDUseCase.execute(unidadeId);
            expect(resultado?.conteudos).toHaveLength(3);
            expect(resultado?.conteudos.every(c => c.id && c.tipo && c.conteudo)).toBe(true);
        });
        it("Deve buscar unidade sem conteúdos", async () => {
            const unidadeId = randomUUID();
            const disciplinaId = randomUUID();
            const unidadeMock = new Unidade(unidadeId, disciplinaId, "QUÍMICA ORGÂNICA", new Date());
            mockUnidadeRepository.findByID.mockResolvedValue(unidadeMock);
            mockConteudoGeradoRepository.listarPorUnidade.mockResolvedValue([]);
            const resultado = await buscarUnidadePorIDUseCase.execute(unidadeId);
            expect(resultado).not.toBeNull();
            expect(resultado?.conteudos).toHaveLength(0);
        });
    });
    describe("DeleteUnidadeUseCase", () => {
        it("Deve excluir uma unidade existente", async () => {
            const unidadeId = randomUUID();
            const unidadeMock = new Unidade(unidadeId, randomUUID(), "GEOMETRIA", new Date());
            mockUnidadeRepository.findByID.mockResolvedValue(unidadeMock);
            mockUnidadeRepository.excluir.mockResolvedValue(undefined);
            const resultado = await deleteUnidadeUseCase.execute(unidadeId);
            expect(mockUnidadeRepository.findByID).toHaveBeenCalledWith(unidadeId);
            expect(mockUnidadeRepository.excluir).toHaveBeenCalledWith(unidadeId);
            expect(resultado).toBe(true);
        });
        it("Deve lançar erro ao tentar excluir unidade inexistente", async () => {
            const unidadeId = randomUUID();
            mockUnidadeRepository.findByID.mockResolvedValue(null);
            await expect(deleteUnidadeUseCase.execute(unidadeId)).rejects.toThrow("Unidade não encontrada");
        });
        it("Deve lançar erro ao tentar excluir com ID vazio", async () => {
            await expect(deleteUnidadeUseCase.execute("")).rejects.toThrow("ID da unidade é obrigatório.");
        });
        it("Deve lançar erro ao tentar excluir com ID contendo apenas espaços", async () => {
            await expect(deleteUnidadeUseCase.execute("   ")).rejects.toThrow("ID da unidade é obrigatório.");
        });
    });
});
