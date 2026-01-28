# Frontend — AI Assistant for Teacher

Este projeto representa o **frontend** da plataforma **AI Assistant for Teacher**, responsável por fornecer a interface para professores criarem e visualizarem conteúdos didáticos alinhados à BNCC, consumindo uma API já existente construída com Clean Architecture.

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
- **Axios** — Comunicação HTTP com o backend
- **ESLint** — Padronização e qualidade de código

---

## 📁 Estrutura de Pastas

A estrutura do projeto segue uma adaptação da **Clean Architecture para frontend**:

```txt
src/
├─ app/
│  ├─ router/
│  │  └─ index.tsx
│  │
│  └─ providers/
│     └─ index.tsx
│
├─ domain/
│  ├─ entities/
│  │  ├─ Discipline.ts
│  │  ├─ Unit.ts
│  │  └─ Content.ts
│  │
│  └─ dtos/
│     ├─ CreateDisciplineDTO.ts
│     ├─ CreateUnitDTO.ts
│     └─ GenerateContentDTO.ts
│
├─ infrastructure/
│  ├─ http/
│  │  └─ api.ts
│  │
│  └─ services/
│     ├─ discipline.service.ts
│     ├─ unit.service.ts
│     └─ content.service.ts
│
├─ presentation/
│  ├─ pages/
│  │  ├─ DashboardPage/
│  │  ├─ DisciplinePage/
│  │  ├─ CreateUnitPage/
│  │  └─ UnitViewPage/
│  │
│  └─ components/
│     ├─ Button/
│     ├─ Select/
│     └─ Card/
│
├─ styles/
│  └─ theme.css
│
├─ App.tsx
└─ main.tsx
