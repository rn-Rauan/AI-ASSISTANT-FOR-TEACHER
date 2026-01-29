export const mockDisciplinaRepository = {
    criar: jest.fn(),
    findByID: jest.fn(),
    listar: jest.fn(),
    excluir: jest.fn(),
};
export const mockUnidadeRepository = {
    criar: jest.fn(),
    findByID: jest.fn(),
    listar: jest.fn(),
    excluir: jest.fn(),
};
export const mockConteudoGeradoRepository = {
    criar: jest.fn(),
    buscarPorID: jest.fn(),
    listarPorUnidade: jest.fn(),
    update: jest.fn(),
};
export const mockAIservice = {
    sugerirTemasCulturaDigital: jest.fn(),
    gerarPlanoDeAula: jest.fn(),
    gerarAtividade: jest.fn(),
    refinarAtividade: jest.fn(),
    refinarPlanoDeAula: jest.fn(),
    refinarSlide: jest.fn()
};
export const mockBnccService = {
    disciplinaValida: jest.fn(),
};
export const mockRagBnccService = {
    consultarBNCC: jest.fn(),
};
