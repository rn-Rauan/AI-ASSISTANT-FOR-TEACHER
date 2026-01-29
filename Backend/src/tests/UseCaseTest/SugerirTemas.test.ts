import { SugerirTemasUseCase } from "../../01-application/usecases/TemasUseCase/SugerirTemasUseCase";
import { mockDisciplinaRepository, mockAIservice } from "../mocks/Mocks";
import { Disciplina } from "../../02-domain/entities/Disciplina";
import { randomUUID } from "node:crypto";

describe("SugerirTemasUseCase", () => {
    let sugerirTemasUseCase: SugerirTemasUseCase;

    beforeEach(() => {
        jest.clearAllMocks();
        sugerirTemasUseCase = new SugerirTemasUseCase(mockDisciplinaRepository, mockAIservice);
    });

    it("Deve sugerir temas para uma disciplina válida", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");
        const temasSugeridos = [
            "Criptografia e Segurança Digital",
            "Algoritmos e Lógica de Programação",
            "Estatística em Redes Sociais",
            "Modelagem Matemática em Jogos Digitais",
            "Inteligência Artificial e Machine Learning"
        ];

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockAIservice.sugerirTemasCulturaDigital.mockResolvedValue(temasSugeridos);

        const resultado = await sugerirTemasUseCase.execute(disciplinaId);

        expect(mockDisciplinaRepository.findByID).toHaveBeenCalledWith(disciplinaId);
        expect(mockAIservice.sugerirTemasCulturaDigital).toHaveBeenCalledWith(
            expect.any(String), // nome da disciplina
            expect.any(String)  // nome do ano/série
        );
        expect(resultado.sugestoes).toEqual(temasSugeridos);
        expect(resultado.sugestoes).toHaveLength(5);
    });

    it("Deve lançar erro quando disciplina não existe", async () => {
        const disciplinaId = randomUUID();

        mockDisciplinaRepository.findByID.mockResolvedValue(null);

        await expect(sugerirTemasUseCase.execute(disciplinaId)).rejects.toThrow(
            "Disciplina não encontrada"
        );
    });

    it("Deve sugerir temas para diferentes disciplinas", async () => {
        const disciplinas = [
            { id: randomUUID(), codigo: "LP" as const, serie: "8_ANO" as const, temas: ["Fake News", "Mídias Digitais"] },
            { id: randomUUID(), codigo: "CI" as const, serie: "7_ANO" as const, temas: ["Tecnologia Verde", "Robótica"] },
            { id: randomUUID(), codigo: "HI" as const, serie: "6_ANO" as const, temas: ["História Digital", "Museus Virtuais"] },
        ];

        for (const disc of disciplinas) {
            const disciplinaMock = new Disciplina(disc.id, disc.codigo, disc.serie);
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            mockAIservice.sugerirTemasCulturaDigital.mockResolvedValue(disc.temas);

            const resultado = await sugerirTemasUseCase.execute(disc.id);

            expect(resultado.sugestoes).toEqual(disc.temas);
        }
    });

    it("Deve retornar array vazio quando AI não sugere temas", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "MA", "9_ANO");

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockAIservice.sugerirTemasCulturaDigital.mockResolvedValue([]);

        const resultado = await sugerirTemasUseCase.execute(disciplinaId);

        expect(resultado.sugestoes).toEqual([]);
        expect(resultado.sugestoes).toHaveLength(0);
    });

    it("Deve chamar AI com nomes formatados da disciplina e série", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "LP", "9_ANO");
        const temasMock = ["Tema 1", "Tema 2"];

        mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
        mockAIservice.sugerirTemasCulturaDigital.mockResolvedValue(temasMock);

        await sugerirTemasUseCase.execute(disciplinaId);

        expect(mockAIservice.sugerirTemasCulturaDigital).toHaveBeenCalled();
        const chamadaArgs = mockAIservice.sugerirTemasCulturaDigital.mock.calls[0];
        expect(chamadaArgs[0]).toBeTruthy(); // nome da disciplina
        expect(chamadaArgs[1]).toBeTruthy(); // nome da série
    });

    it("Deve lidar com diferentes quantidades de sugestões", async () => {
        const disciplinaId = randomUUID();
        const disciplinaMock = new Disciplina(disciplinaId, "MA", "8_ANO");
        
        const quantidades = [3, 5, 7, 10];

        for (const qtd of quantidades) {
            const temas = Array.from({ length: qtd }, (_, i) => `Tema ${i + 1}`);
            mockDisciplinaRepository.findByID.mockResolvedValue(disciplinaMock);
            mockAIservice.sugerirTemasCulturaDigital.mockResolvedValue(temas);

            const resultado = await sugerirTemasUseCase.execute(disciplinaId);

            expect(resultado.sugestoes).toHaveLength(qtd);
        }
    });
});
