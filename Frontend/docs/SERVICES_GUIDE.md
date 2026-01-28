# Documentação dos Services do Frontend

Este documento descreve todos os services disponíveis no frontend e como utilizá-los.

## 📦 Importação

```typescript
// Importar services individuais
import { 
  disciplinaService, 
  unidadeService, 
  conteudoService, 
  slideService 
} from '@/infrastructure/services';

```

## 🎓 Disciplina Service

### `disciplinaService.getAll()`
Lista todas as disciplinas cadastradas.

```typescript
const disciplinas = await disciplinaService.getAll();
// Retorna: Disciplina[]
```

### `disciplinaService.getById(id)`
Busca uma disciplina específica por ID.

```typescript
const disciplina = await disciplinaService.getById('abc-123');
// Retorna: Disciplina
```

### `disciplinaService.create(data)`
Cria uma nova disciplina.

```typescript
const novaDisciplina = await disciplinaService.create({
  nome: 'Matemática',
  serie: '5_ANO',
  codigo: 'MAT'
});
// Retorna: Disciplina
```

### `disciplinaService.delete(id)`
Deleta uma disciplina.

```typescript
await disciplinaService.delete('abc-123');
// Retorna: void
```

---

## 📚 Unidade Service

### `unidadeService.listarPorDisciplina(disciplinaId)`
Lista todas as unidades de uma disciplina.

```typescript
const unidades = await unidadeService.listarPorDisciplina('disciplina-id');
// Retorna: Unidade[]
```

### `unidadeService.getById(id)`
Busca uma unidade específica por ID.

```typescript
const unidade = await unidadeService.getById('unidade-id');
// Retorna: Unidade
```

### `unidadeService.delete(id)`
Deleta uma unidade.

```typescript
await unidadeService.delete('unidade-id');
// Retorna: void
```

---

## 📝 Conteúdo Service

### `conteudoService.gerar(dados)`
**Rota principal**: Cria uma nova unidade e gera múltiplos conteúdos via IA.

```typescript
const resultado = await conteudoService.gerar({
  disciplina_id: 'disciplina-123',
  tema: 'Frações',
  observacoes: 'Focar em exercícios práticos', // opcional
  tipos: ['plano_de_aula', 'atividade', 'slide']
});

// Retorna:
// {
//   message: string,
//   unidade: Unidade,
//   conteudos: Conteudo[]
// }
```

### `conteudoService.listarPorUnidade(unidadeId)`
Lista todos os conteúdos de uma unidade.

```typescript
const conteudos = await conteudoService.listarPorUnidade('unidade-id');
// Retorna: Conteudo[]
```

### `conteudoService.atualizar(conteudoId, conteudo)`
Atualiza o texto de um conteúdo existente.

```typescript
const resultado = await conteudoService.atualizar(
  'conteudo-id',
  'Novo texto do conteúdo...'
);

// Retorna:
// {
//   message: string,
//   conteudoAtualizado: Conteudo
// }
```

### `conteudoService.refinar(dados)`
Refina múltiplos conteúdos com base em uma instrução.

```typescript
const resultado = await conteudoService.refinar({
  unidade_id: 'unidade-id',
  conteudos_ids: ['conteudo-1', 'conteudo-2'],
  instrucao: 'Adicione mais exemplos práticos'
});

// Retorna:
// {
//   message: string,
//   conteudos: Conteudo[]
// }
```

### `conteudoService.sugerirTemas(disciplinaId)`
Sugere temas baseados na BNCC para uma disciplina.

```typescript
const temas = await conteudoService.sugerirTemas('disciplina-id');
// Retorna: string[]
// Exemplo: ['Frações', 'Números Decimais', 'Geometria Espacial']
```

---

## 🎨 Slide Service

### `slideService.getPreview(conteudoId)`
Busca o preview em markdown de um slide.

```typescript
const preview = await slideService.getPreview('conteudo-id');

// Retorna:
// {
//   id: string,
//   tipo: string,
//   conteudo: string,  // markdown
//   formato: 'markdown'
// }
```

### `slideService.downloadPPTX(conteudoId)`
Baixa o arquivo PPTX como Blob.

```typescript
const blob = await slideService.downloadPPTX('conteudo-id');
// Retorna: Blob
// Use para manipulação avançada
```

### `slideService.downloadPPTXDireto(conteudoId, nomeArquivo?)`
**Recomendado**: Faz o download direto do PPTX no navegador.

```typescript
await slideService.downloadPPTXDireto('conteudo-id', 'minha-aula.pptx');
// Retorna: void
// O arquivo será baixado automaticamente
```

---

## 🏗️ Tipos de Conteúdo

Os seguintes tipos de conteúdo podem ser gerados:

```typescript
type TipoConteudo = 'plano_de_aula' | 'atividade' | 'slide';
```

---

## ⚠️ Tratamento de Erros

Todos os services podem lançar erros. Use try-catch:

```typescript
try {
  const disciplinas = await disciplinaService.getAll();
} catch (error) {
  console.error('Erro ao buscar disciplinas:', error);
  // Tratar erro (mostrar mensagem ao usuário, etc)
}
```

---

## 🔄 Fluxo Típico de Uso

### 1. Criar Disciplina
```typescript
const disciplina = await disciplinaService.create({
  nome: 'Matemática',
  serie: '5_ANO',
  codigo: 'MAT'
});
```

### 2. Sugerir Temas
```typescript
const temas = await conteudoService.sugerirTemas(disciplina.id);
// Usuário escolhe um tema
```

### 3. Gerar Conteúdos
```typescript
const resultado = await conteudoService.gerar({
  disciplina_id: disciplina.id,
  tema: temas[0], // ou tema digitado pelo usuário
  tipos: ['plano_de_aula', 'atividade', 'slide']
});

// resultado.unidade = nova unidade criada
// resultado.conteudos = array com os 3 conteúdos gerados
```

### 4. Listar Unidades
```typescript
const unidades = await unidadeService.listarPorDisciplina(disciplina.id);
```

### 5. Ver Conteúdos de uma Unidade
```typescript
const conteudos = await conteudoService.listarPorUnidade(unidade.id);
```

### 6. Refinar Conteúdos (se necessário)
```typescript
const refinados = await conteudoService.refinar({
  unidade_id: unidade.id,
  conteudos_ids: [conteudo1.id, conteudo2.id],
  instrucao: 'Adicione mais exemplos práticos'
});
```

### 7. Download de Slides
```typescript
// Encontre o conteúdo do tipo 'slide'
const slide = conteudos.find(c => c.tipo === 'slide');

if (slide) {
  await slideService.downloadPPTXDireto(slide.id, 'aula-fracoes.pptx');
}
```

---

## 📋 Configuração da API

O baseURL da API está configurado em:
```
Frontend/src/infrastructure/http/api.ts
```

Valor atual: `http://192.168.31.39:3131`

Para ambiente de desenvolvimento local, altere para:
```typescript
baseURL: 'http://localhost:3131'
```

---

## 🎯 Resumo das Rotas Backend

| Método | Rota | Descrição | Service |
|--------|------|-----------|---------|
| GET | `/disciplinas` | Listar disciplinas | `disciplinaService.getAll()` |
| POST | `/disciplinas` | Criar disciplina | `disciplinaService.create()` |
| GET | `/disciplinas/:id` | Obter disciplina | `disciplinaService.getById()` |
| DELETE | `/disciplinas/:id` | Deletar disciplina | `disciplinaService.delete()` |
| GET | `/disciplinas/:id/sugerir-temas` | Sugerir temas | `conteudoService.sugerirTemas()` |
| GET | `/unidades` | Listar unidades | `unidadeService.listarPorDisciplina()` |
| GET | `/unidades/:id` | Obter unidade | `unidadeService.getById()` |
| DELETE | `/unidades/:id` | Deletar unidade | `unidadeService.delete()` |
| POST | `/gerar/conteudos` | Gerar unidade + conteúdos | `conteudoService.gerar()` |
| GET | `/conteudos/:id` | Listar conteúdos | `conteudoService.listarPorUnidade()` |
| PUT | `/conteudos/:id` | Atualizar conteúdo | `conteudoService.atualizar()` |
| POST | `/conteudos/refinar` | Refinar conteúdos | `conteudoService.refinar()` |
| GET | `/slides/:id/preview` | Preview slide | `slideService.getPreview()` |
| GET | `/slides/:id/download` | Download PPTX | `slideService.downloadPPTX()` |
