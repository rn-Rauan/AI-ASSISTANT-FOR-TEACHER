# 📊 Relatório de Testes - Backend

## 📋 Índice
- [Visão Geral](#visão-geral)
- [Como Executar os Testes](#como-executar-os-testes)
- [Estrutura dos Testes](#estrutura-dos-testes)
- [Cobertura de Testes](#cobertura-de-testes)
- [Decisões de Teste](#decisões-de-teste)
- [Testes Implementados](#testes-implementados)

---

## 🎯 Visão Geral

Este documento descreve a estratégia de testes implementada no backend do AI Assistant for Teacher. Os testes focam nos **Use Cases** (camada de aplicação), garantindo que a lógica de negócio funcione corretamente de forma isolada.

### Estatísticas Atuais
- **Total de Testes**: 52
- **Suítes de Teste**: 5
- **Status**: ✅ 100% passando
- **Framework**: Jest + ts-jest

---

## 🚀 Como Executar os Testes

### Comando Básico
```bash
npm test
```
ou
```bash
npm run test
```

Este comando executa todos os testes e exibe o resultado no terminal.

### Comando com Cobertura
```bash
npm run test:coverage
```

Este comando executa os testes e gera um relatório de cobertura de código, mostrando:
- % de linhas cobertas
- % de funções cobertas
- % de branches cobertas
- % de statements cobertos

O relatório HTML detalhado é gerado em `coverage/lcov-report/index.html`.

### Modo Watch (Desenvolvimento)
```bash
npm test -- --watch
```

Executa os testes em modo watch, re-executando automaticamente quando arquivos são modificados.

---

## 📁 Estrutura dos Testes

```
src/tests/
├── mocks/
│   └── Mocks.ts                    # Mocks dos repositórios e serviços
└── UseCaseTest/
    ├── Disciplina.test.ts          # 17 testes
    ├── Unidade.test.ts             # 13 testes
    ├── Conteudo.test.ts            # 9 testes
    ├── ListarUnidades.test.ts      # 7 testes
    └── SugerirTemas.test.ts        # 6 testes
```

### Padrão de Nomenclatura
- **Arquivos**: `[UseCase].test.ts`
- **Describes**: Agrupam testes por Use Case
- **It/Test**: Descreve o comportamento esperado em português

---

## 🎯 Por Que Testamos os Use Cases?

### 1. **Lógica de Negócio Centralizada**
Os Use Cases contêm toda a lógica de negócio da aplicação. Testar esta camada garante que as regras de negócio funcionem independentemente da infraestrutura (banco de dados, APIs externas, etc.).

### 2. **Isolamento e Rapidez**
Usando mocks, conseguimos:
- ✅ Testes rápidos (não dependem de banco de dados real)
- ✅ Ambiente controlado e previsível
- ✅ Testes independentes entre si
- ✅ Fácil identificação de bugs

### 3. **Documentação Viva**
Os testes servem como documentação do comportamento esperado do sistema:
```typescript
it("Deve criar uma nova disciplina", async () => {
  // Teste documenta exatamente o que o UseCase faz
});
```

### 4. **Confiança para Refatoração**
Com boa cobertura de testes, podemos refatorar código com segurança, sabendo que se algo quebrar, os testes vão detectar.

---

## 📊 Cobertura de Testes

### Use Cases Cobertos

#### 1. **Disciplina Use Cases** (17 testes)

**CriarDisciplinaUseCase** (4 testes)
- ✅ Criação de disciplina válida
- ✅ Formatação automática para maiúsculas
- ✅ Validação de disciplina inválida
- ✅ Criação de múltiplas disciplinas

**DeleteDisciplinaUseCase** (4 testes)
- ✅ Exclusão de disciplina existente
- ✅ Erro ao excluir disciplina inexistente
- ✅ Validação de ID vazio
- ✅ Validação de ID com apenas espaços

**ListarDisciplinaUseCase** (4 testes)
- ✅ Listagem de todas as disciplinas
- ✅ Lista vazia quando não há disciplinas
- ✅ Mapeamento correto de nomes
- ✅ Listagem de múltiplas disciplinas

**ListarDisciplinaPorIDUseCase** (5 testes)
- ✅ Busca por ID válido
- ✅ Erro ao buscar disciplina inexistente
- ✅ Validação de ID vazio
- ✅ Validação de ID com espaços
- ✅ Verificação de todos os campos mapeados

#### 2. **Unidade Use Cases** (13 testes)

**CriarUnidadeUseCase** (4 testes)
- ✅ Criação de unidade válida
- ✅ Erro com disciplina inexistente
- ✅ Formatação de tema para maiúsculas
- ✅ Múltiplas unidades para mesma disciplina

**BuscarUnidadePorIDUseCase** (5 testes)
- ✅ Busca com conteúdos associados
- ✅ Retorno null para unidade inexistente
- ✅ Validação de ID vazio
- ✅ Busca com múltiplos conteúdos
- ✅ Busca de unidade sem conteúdos

**DeleteUnidadeUseCase** (4 testes)
- ✅ Exclusão de unidade existente
- ✅ Erro ao excluir unidade inexistente
- ✅ Validação de ID vazio
- ✅ Validação de ID com espaços

#### 3. **Conteúdo Use Cases** (9 testes)

**AtualizarConteudoUseCase** (5 testes)
- ✅ Atualização de conteúdo existente
- ✅ Erro ao atualizar conteúdo inexistente
- ✅ Validação de parâmetros obrigatórios
- ✅ Manutenção de outros campos
- ✅ Atualização de diferentes tipos (plano, atividade, slide)

**ListarConteudosUseCase** (4 testes)
- ✅ Listagem de conteúdos de uma unidade
- ✅ Lista vazia quando não há conteúdos
- ✅ Verificação de todas as propriedades
- ✅ Filtragem correta por unidade

#### 4. **Listar Unidades Use Case** (7 testes)
- ✅ Listagem de unidades por disciplina
- ✅ Erro quando ID não é fornecido
- ✅ Erro quando disciplina não existe
- ✅ Lista vazia quando não há unidades
- ✅ Mapeamento correto de campos
- ✅ Separação por disciplinas diferentes
- ✅ Listagem de múltiplas unidades

#### 5. **Sugerir Temas Use Case** (6 testes)
- ✅ Sugestão de temas para disciplina válida
- ✅ Erro quando disciplina não existe
- ✅ Sugestões para diferentes disciplinas
- ✅ Array vazio quando IA não sugere
- ✅ Chamada correta da IA com nomes formatados
- ✅ Diferentes quantidades de sugestões

---

## 🧪 Estratégia de Testes

### Tipos de Testes Implementados

#### ✅ **Happy Path (Caminho Feliz)**
Testa o fluxo normal, quando tudo funciona corretamente.
```typescript
it("Deve criar uma nova disciplina", async () => {
  // Setup de mocks e dados válidos
  const resultado = await criarDisciplinaUseCase.execute(validDTO);
  // Verificações de sucesso
});
```

#### ❌ **Validações e Erros**
Testa cenários de erro e validações de entrada.
```typescript
it("Deve lançar erro ao tentar excluir disciplina inexistente", async () => {
  mockRepository.findByID.mockResolvedValue(null);
  await expect(deleteUseCase.execute(id)).rejects.toThrow("Disciplina não encontrada");
});
```

#### 🔄 **Edge Cases (Casos Extremos)**
Testa situações limites e casos especiais.
```typescript
it("Deve retornar lista vazia quando não há disciplinas", async () => {
  mockRepository.listar.mockResolvedValue([]);
  const resultado = await listarUseCase.execute();
  expect(resultado).toHaveLength(0);
});
```

#### 🎨 **Formatação e Transformação**
Testa transformações de dados.
```typescript
it("Deve formatar código e série para maiúsculas ao criar disciplina", async () => {
  // Testa se o sistema normaliza os dados corretamente
});
```

---

## 🛠️ Ferramentas e Configuração

### Jest Configuration
Arquivo: `jest.config.ts`
```typescript
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

### Mocks Centralizados
Arquivo: `src/tests/mocks/Mocks.ts`

Todos os mocks de repositórios e serviços estão centralizados, facilitando manutenção:
```typescript
export const mockDisciplinaRepository: jest.Mocked<IDisciplinaRepository>;
export const mockUnidadeRepository: jest.Mocked<IUnidadeRepository>;
export const mockConteudoGeradoRepository: jest.Mocked<IConteudoGeradoRepository>;
export const mockAIservice: jest.Mocked<IAIService>;
export const mockBnccService: jest.Mocked<IBnccService>;
```

---

## 📈 Próximos Passos

### Áreas para Expandir Cobertura

1. **Use Cases Não Cobertos**
   - GerarUnidadeEConteudosUseCase
   - RefinarConteudoUseCase
   - GerarPPTXUseCase
   - BuscarPreviewSlideUseCase

2. **Testes de Integração**
   - Testes com banco de dados real
   - Testes de endpoints HTTP (Feitos manualmente)

3. **Testes de Entidades**
   - Validações de domínio
   - Regras de negócio nas entidades

4. **Testes de Performance**
   - Testes de carga
   - Benchmarks de operações críticas

---

## 📝 Boas Práticas Seguidas

- ✅ **AAA Pattern**: Arrange, Act, Assert
- ✅ **Isolamento**: Cada teste é independente
- ✅ **Nomenclatura Clara**: Testes descrevem o comportamento esperado
- ✅ **BeforeEach**: Limpa mocks antes de cada teste
- ✅ **Mocks Adequados**: Simula dependências externas
- ✅ **Cobertura Balanceada**: Happy path + edge cases + validações

---

## 🤝 Contribuindo com Testes

### Ao Adicionar Novos Testes

1. **Siga o padrão AAA**
   ```typescript
   it("Deve fazer algo específico", async () => {
     // Arrange: Prepare os dados e mocks
     const dados = { /* ... */ };
     mockRepository.metodo.mockResolvedValue(resultado);
     
     // Act: Execute a ação
     const resultado = await useCase.execute(dados);
     
     // Assert: Verifique o resultado
     expect(resultado).toBeDefined();
     expect(mockRepository.metodo).toHaveBeenCalledWith(dados);
   });
   ```

2. **Teste Casos de Erro**
   ```typescript
   it("Deve lançar erro quando [condição]", async () => {
     await expect(useCase.execute(dadosInvalidos))
       .rejects.toThrow("Mensagem de erro esperada");
   });
   ```

3. **Limpe Mocks no beforeEach**
   ```typescript
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

---

## 📞 Suporte

Para dúvidas sobre os testes:
- Consulte a documentação do Jest: https://jestjs.io/
- Veja exemplos nos arquivos de teste existentes
- Verifique a estrutura de mocks em `src/tests/mocks/Mocks.ts`

---

**Última Atualização**: 28 de Janeiro de 2026  
**Versão**: 1.0.0
