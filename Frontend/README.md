# Frontend — AI Assistant for Teacher

Este projeto representa o **frontend** da plataforma **PedagogIA**, responsável por fornecer a interface para professores criarem e visualizarem conteúdos didáticos alinhados à BNCC, consumindo uma API já existente construída com Clean Architecture.

O frontend foi desenvolvido com foco em:
- Tipagem forte com TypeScript
- Separação clara de responsabilidades (Domain, Infrastructure, Presentation)
- Facilidade de manutenção e evolução
- Integração limpa com o backend (sem regras de negócio no front)
- Services prontos para uso nas páginas

---

## 🧠 Responsabilidades do Frontend

O frontend é responsável por:

- Renderizar as telas da aplicação
- Coletar dados do professor (ano, disciplina, assunto, etc.)
- Enviar requisições HTTP para o backend via services
- Exibir os conteúdos gerados pela API
- Controlar navegação entre telas
- Gerenciar estado de interface (loading, erro, sucesso)

### ❌ O frontend NÃO é responsável por:
- Regras de negócio complexas
- Lógica de IA
- Validações pedagógicas
- Persistência de dados
- Decisões educacionais

> Todas essas responsabilidades já estão centralizadas no backend, seguindo Clean Architecture.

---

## 🛠️ Tecnologias Utilizadas

- **React** — Biblioteca para construção de interfaces
- **Vite** — Bundler e ambiente de desenvolvimento
- **TypeScript (strict)** — Tipagem forte e segura
- **Tailwind CSS** — Framework de estilização utilitário
- **Shadcn/ui** — Componentes reutilizáveis (Radix UI + Tailwind)
- **Lucide React** — Biblioteca de ícones
- **Axios** — Comunicação HTTP com o backend
- **React Markdown** — Renderização de conteúdo em Markdown
- **html2pdf.js** — Exportação de conteúdo para PDF
- **ESLint** — Padronização e qualidade de código

---

## 📁 Estrutura de Pastas

A estrutura do projeto segue uma adaptação da **Clean Architecture para frontend**:

```txt
src/
├─ app/
│  └─ router/
│     └─ index.tsx          # Configuração de rotas
│
├─ components/
│  └─ ui/                   # Componentes reutilizáveis (Shadcn/ui)
│     ├─ Button.tsx
│     ├─ Input.tsx
│     ├─ Card.tsx
│     ├─ Dialog.tsx
│     └─ ...
│
├─ constants/               # Constantes globais
│  └─ domain-options.ts
│
├─ domain/                  # Camada de Domínio (Tipos e Interfaces)
│  ├─ entities/
│  │  ├─ Disciplina.ts
│  │  ├─ Unidade.ts
│  │  └─ Conteudo.ts
│  │
│  └─ dtos/                 # Data Transfer Objects
│     ├─ CriarDisciplinaDTO.ts
│     ├─ CriarUnidadeDTO.ts
│     └─ GerarConteudoDTO.ts
│
├─ infrastructure/          # Camada de Infraestrutura (Comunicação externa)
│  ├─ http/
│  │  └─ api.ts             # Configuração do Axios
│  │
│  └─ services/             # Serviços de integração com API
│     ├─ disciplina.service.ts
│     ├─ unidade.service.ts
│     ├─ conteudo.service.ts
│     └─ slide.service.ts
│
├─ lib/                     # Utilitários gerais
│  └─ utils.ts
│
├─ presentation/            # Camada de Apresentação (Telas e Componentes de Negócio)
│  ├─ components/           # Componentes específicos de negócio
│  │  ├─ Header.tsx
│  │  ├─ ModalCriarDisciplina.tsx
│  │  └─ RefineContentModal.tsx
│  │
│  └─ pages/                # Páginas da aplicação
│     ├─ Dashboard/
│     ├─ Disciplina/
│     ├─ Unidade/
│     ├─ CriarDisciplina/
│     └─ CriarUnidade/
│
├─ App.tsx
└─ main.tsx
```
