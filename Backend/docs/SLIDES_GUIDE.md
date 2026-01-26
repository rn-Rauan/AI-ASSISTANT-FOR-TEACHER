# Guia de Uso - Geração de Slides PPTX

## Visão Geral

O sistema agora suporta geração automática de apresentações em PowerPoint (PPTX) a partir de conteúdo em Markdown. A IA gera o conteúdo dos slides e você pode baixá-los em formato PPTX.

## Como Funciona

### 1. Gerar Conteúdo com Slides

Ao criar uma unidade, você pode incluir `"slide"` nos tipos de conteúdo:

```json
POST /gerar/conteudos
{
  "disciplina_id": "uuid-da-disciplina",
  "tema": "Cidadania Digital",
  "tipos": ["plano_de_aula", "slide", "atividade"],
  "observacoes": "Foco em redes sociais"
}
```

**Nota:** Quando você solicita `"plano_de_aula"`, a IA já gera automaticamente o conteúdo para slides junto. Esse conteúdo é armazenado em formato Markdown.

### 2. Visualizar o Conteúdo Markdown

Para ver o conteúdo dos slides antes de baixar o PPTX:

```
GET /slides/:id/preview
```

**Resposta:**
```json
{
  "id": "uuid-do-conteudo",
  "tipo": "slide",
  "conteudo": "# Título do Slide\n- Ponto 1\n- Ponto 2\n\n# Outro Slide\n...",
  "formato": "markdown"
}
```

### 3. Baixar PPTX

Para baixar a apresentação em formato PowerPoint:

```
GET /slides/:id/download
```

Isso retornará um arquivo `.pptx` pronto para uso.

## Formato do Markdown para Slides

O conteúdo dos slides segue uma estrutura específica:

```markdown
# Título da Apresentação
Subtítulo ou descrição breve

# Slide 1 - Conceitos
- Ponto importante 1
- Ponto importante 2
- Ponto importante 3

# Slide 2 - Exemplos
- Exemplo prático
- Aplicação real
- Resultados esperados
```

**Regras:**
- Cada `#` (H1) inicia um novo slide
- O primeiro slide é o slide de título
- Use `-` para listas (bullet points)
- Mantenha textos concisos (máximo 8 pontos por slide)

## Refinar Slides

Você pode refinar o conteúdo dos slides com instruções específicas:

```json
POST /conteudos/refinar
{
  "unidade_id": "uuid-da-unidade",
  "conteudos_ids": ["uuid-do-slide"],
  "instrucao": "Adicione mais exemplos visuais e simplifique os textos"
}
```

## Design dos Slides

Os slides gerados têm:

- **Slide de Título:** Fundo azul escuro (2C3E50) com texto branco
- **Slides de Conteúdo:**
  - Fundo branco
  - Título em azul escuro (2C3E50)
  - Linha decorativa azul (3498DB)
  - Texto em cinza escuro (34495E)
  - Rodapé com numeração
- **Formato:** 10" x 7.5" (padrão PowerPoint)

## Estrutura Técnica

### Serviços Utilizados

1. **SlideService** (`Slide.service.ts`):
   - Converte Markdown em PPTX usando `pptxgenjs`
   - Formata slides com design profissional
   - Divide conteúdo automaticamente

2. **AI.service** (método `refinarSlide`):
   - Refina o conteúdo Markdown dos slides
   - Mantém formato e estrutura
   - Aplica instruções do professor

### Dependências

```json
{
  "pptxgenjs": "^3.x.x",
  "marked": "^11.x.x"
}
```

## Exemplo de Fluxo Completo

```bash
# 1. Criar unidade com slides
POST /gerar/conteudos
{
  "disciplina_id": "123",
  "tema": "Segurança na Internet",
  "tipos": ["plano_de_aula", "slide"]
}

# Resposta inclui o ID do slide
# { "conteudos": [{ "id": "slide-id-123", "tipo": "slide", ... }] }

# 2. Visualizar preview (opcional)
GET /slides/slide-id-123/preview

# 3. Refinar se necessário (opcional)
POST /conteudos/refinar
{
  "unidade_id": "123",
  "conteudos_ids": ["slide-id-123"],
  "instrucao": "Adicione mais ícones e exemplos visuais"
}

# 4. Baixar PPTX
GET /slides/slide-id-123/download
# Retorna: slide-slide-id-123.pptx
```

## Dicas de Uso

### Para Professores

- Os slides são gerados automaticamente a partir do plano de aula
- Você pode refinar o conteúdo antes de baixar
- O PPTX pode ser editado no PowerPoint/Google Slides após o download
- Recomenda-se revisar antes de usar em sala de aula

### Boas Práticas

1. **Conteúdo Conciso:** Evite textos longos - slides são para pontos-chave
2. **Estrutura Clara:** Use títulos descritivos para cada slide
3. **Listas:** Prefira bullet points para facilitar leitura
4. **Refinamento:** Use o refinamento para ajustar o nível de detalhe

## Limitações Atuais

- Não suporta imagens (apenas texto)
- Design fixo (cores e layout pré-definidos)
- Máximo de 8 pontos por slide para melhor legibilidade

## Próximos Passos (Roadmap)

- [ ] Suporte a imagens da internet
- [ ] Temas customizáveis
- [ ] Gráficos e diagramas
- [ ] Exportação para PDF
- [ ] Templates por disciplina
