# PedagogIA — AI Assistant for Teacher

Plataforma inteligente para auxiliar professores na criação de planos de aula, atividades e slides alinhados à BNCC e à Cultura Digital.

## Contexto e Aderência ao Edital

Este projeto foi desenvolvido para o **Hackathon Cultura Digital**, categoria "Desenvolvimento de Sistema Inteligente para Geração de Materiais Didáticos".
A solução atende integralmente aos requisitos do edital, focando em:
- **Alinhamento à BNCC**: Uso de RAG para garantir conformidade com diretrizes educacionais.
- **Produtividade Docente**: Geração automatizada de planos de aula e apresentações.
- **Cultura Digital**: Foco em materiais para letramento digital.

## 🚀 Funcionalidades Principais

| RF | Funcionalidade | Status | Camada |
|---|---|---|---|
| RF01 | Cadastro de Disciplinas | ✅ Implementado | Fullstack |
| RF02 | Gestão de Unidades Temáticas | ✅ Implementado | Fullstack |
| RF03 | Geração de Plano de Aula (IA) | ✅ Implementado | Backend (IA) |
| RF04 | Geração de Atividades (IA) | ✅ Implementado | Backend (IA) |
| RF05 | Exportação de Slides (PPTX) | ✅ Implementado | Backend |
| RF06 | Validação Pedagógica (BNCC) | ✅ Implementado | RAG Service |

## 🏗️ Visão Geral da Arquitetura

O sistema segue os princípios da **Clean Architecture** para garantir desacoplamento e testabilidade.


- **Frontend**: React, Vite, TypeScript, Tailwind, Shadcn/ui.
- **Backend**: Node.js, Fastify, Prisma, Clean Architecture.
- **IA**: Integração com LLMs via OpenAI e RAG para contexto da BNCC.

## 💾 Modelos de Dados Principais

### Entidades (Domain)
- **Disciplina**: Matéria lecionada (ex: Cultura Digital, 6º Ano).
- **Unidade**: Tópico específico da disciplina (ex: Segurança na Internet).
- **Conteudo**: Material gerado (Plano de Aula, Slide, Atividade).

### DTOs (Data Transfer Objects)
- `CriarDisciplinaDTO`: Dados para criar disciplina (nome, ano).
- `CriarUnidadeDTO`: Tópicos e objetivos da unidade.
- `GerarConteudoDTO`: Parâmetros para geração via IA.

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js v18+
- NPM ou Yarn

### 1. Backend
```bash
cd Backend
npm install
cp .env.example .env # Configurar OPENAI_API_KEY e DATABASE_URL
npx prisma migrate dev
npm run dev
# Rodando em: http://localhost:3131
```

### 2. Frontend
```bash
cd Frontend
npm install
npm run dev
# Rodando em: http://localhost:5173
```

## 🔌 Endpoints Principais

- `GET /disciplinas`: Lista todas as disciplinas.
- `POST /disciplinas`: Cria nova disciplina.
- `POST /unidades`: Listar unidades de uma disciplina
- `POST /gerar/conteudos`: Gera plano de aula e atividades via IA.
- `POST /slides/:id/preview`: Preview do conteúdo markdown dos slides.

## 📱 UI / Fluxo do Usuário

1. **Dashboard**: Visão geral e acesso rápido.
2. **Criar Disciplina**: Define o contexto da turma.
3. **Criar Unidade**: IA sugere temas baseados na BNCC.
4. **Visualizar Conteúdo**: Professor revisa o material gerado.
5. **Exportar**: Download em PDF ou PPTX.

## 🤖 Uso de Inteligência Artificial

A IA atua como **núcleo gerador** da solução:
- **Geração de Texto**: Criação de planos de aula detalhados e questões avaliativas.
- **RAG (Retrieval-Augmented Generation)**: Consulta diretrizes da BNCC para garantir que o conteúdo gerado esteja pedagogicamente correto.
- **Automação**: Conversão de conteúdo textual em slides estruturados (PPTX).

> **Declaração de Autoria**: A IA foi utilizada para geração de assets e auxílio na codificação, mas toda a lógica de negócio, arquitetura e curadoria pedagógica foram desenvolvidas pela equipe.

## 📂 Estrutura do Repositório

```
src/
├── 01-application/   # Casos de uso (Regras de negócio)
├── 02-domain/        # Entidades e Interfaces
├── 03-infrastructure/# Web, DB, Serviços Externos
├── DI/               # Injeção de Dependência
└── server.ts         # Entry point
```

**Mais documentação em Backend/docs**

## 📄 Licença e Créditos

Este projeto é open-source sob a licença **MIT**.
Desenvolvido para o Hackathon Cultura Digital.

