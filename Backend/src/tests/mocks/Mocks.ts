import { IDisciplinaRepository } from "../../02-domain/interfaces/IDisciplinaRepository";
import { IUnidadeRepository } from "../../02-domain/interfaces/IUnidadeRepository";
import { IConteudoGeradoRepository } from "../../02-domain/interfaces/IConteudoGeradoRepository";
import { IAIService } from "../../02-domain/interfaces/IAIService";
import { IBnccService } from "../../02-domain/interfaces/IBnccService";
import { IRagBnccService } from "../../02-domain/interfaces/IRagBnccService";

export const mockDisciplinaRepository: jest.Mocked<IDisciplinaRepository> = {
    criar: jest.fn(),
    findByID: jest.fn(),
    listar: jest.fn(),
    excluir: jest.fn(),
};

export const mockUnidadeRepository : jest.Mocked<IUnidadeRepository> ={
    criar: jest.fn(),
    findByID: jest.fn(),
    listar: jest.fn(),
    excluir: jest.fn(),
}

export const mockConteudoGeradoRepository : jest.Mocked<IConteudoGeradoRepository> = {
    criar: jest.fn(),
    buscarPorID: jest.fn(),
    listarPorUnidade: jest.fn(),
    update: jest.fn(),
}

export const mockAIservice : jest.Mocked<IAIService> ={
    sugerirTemasCulturaDigital: jest.fn(),
    gerarPlanoDeAula: jest.fn(),
    gerarAtividade: jest.fn(),
    refinarAtividade: jest.fn(),
    refinarPlanoDeAula: jest.fn(),
    refinarSlide: jest.fn()
}

export const mockBnccService : jest.Mocked<IBnccService> = {
    disciplinaValida: jest.fn(),
}

export const mockRagBnccService : jest.Mocked<IRagBnccService> = {
    consultarBNCC: jest.fn(),
}