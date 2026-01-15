# ADR-Backend – Arquitetura da API

## Status

Aceito

## Contexto

O projeto consiste em uma API backend responsável por gerenciar disciplinas, unidades de ensino e conteúdos didáticos gerados por Inteligência Artificial. O backend será desenvolvido no contexto de um hackathon, com prazo reduzido, equipe pequena e foco em clareza arquitetural, facilidade de manutenção e capacidade de explicação para avaliadores.

O sistema precisa:

* Expor uma API REST clara para consumo pelo frontend
* Aplicar regras de negócio (validação de disciplina, ano/série, BNCC e diretrizes do MEC)
* Integrar-se a um banco de dados relacional (PostgreSQL via Supabase)
* Integrar-se a um serviço externo de IA para geração de conteúdo
* Utilizar documentos normativos (BNCC e Diretrizes do MEC) como fonte estática de dados educacionais

Diante disso, foi necessário definir uma arquitetura que equilibrasse organização e simplicidade, evitando overengineering.

## Decisão

Foi adotada uma arquitetura em camadas baseada em **Application / Domain / Infrastructure**, com simplificações intencionais para atender ao contexto do projeto.

### Organização em camadas

* **Application**: responsável pelos casos de uso e regras de negócio
* **Domain**: responsável pelas entidades centrais do sistema e regras de negócio puras
* **Infrastructure**: responsável por detalhes técnicos como HTTP, banco de dados e integração com IA

Não foram adotados padrões avançados como DDD completo, Value Objects ou Validators genéricos, a fim de manter a arquitetura simples e objetiva.

## Estrutura de Pastas

```text
docs/           <-- Documentação backend
 |
Prisma/
 |
 ├─ migrations/
 ├─ schema.prisma
 |
src/
 |
 ├─ application/
 │   ├─ usecases/
 │   └─ dtos/
 │
 ├─ domain/
 │   └─ entities/
 |   └─ interfaces
 │
 ├─ infrastructure/
 |   ├─ prisma/
 │   ├─ http/
 │   │   ├─ routes/
 │   │   └─ controllers/
 │   ├─ db/
 │   │   └─ repositories/
 │   └─ ia/
 │
 ├─ data/
 |    ├─ bncc.json
 |    └─ diretrizes_mec.json
 |
 └─ server.ts 
```

## Responsabilidades por Camada

### Domain

* Contém entidades simples que representam os conceitos do sistema:

  * Disciplina
  * Unidade
  * ConteudoGerado
* Não contém lógica de persistência, HTTP ou chamadas externas
* Serve como modelo conceitual do domínio

### Application

* Contém os **casos de uso**, onde ficam as regras de negócio
* Exemplos de responsabilidades:

  * Validar se uma disciplina é permitida
  * Validar se um ano/série é compatível
  * Verificar se um tema pertence à BNCC
  * Aplicar diretrizes pedagógicas do MEC quando pertinente
  * Orquestrar a geração de conteúdo com IA
  * Decidir quais conteúdos serão gerados (plano de aula, atividade, slides)

Os dados da BNCC e das Diretrizes do MEC são carregados a partir de arquivos JSON estáticos e utilizados como referência nos casos de uso.

Todas as validações de negócio são realizadas nesta camada, evitando abstrações adicionais.

### Infrastructure

* Contém detalhes técnicos e frameworks
* HTTP:

  * Fastify
  * Rotas e controllers
* Banco de dados:

  * Prisma
  * Repositórios
* Integração com IA:

  * Cliente para chamada do serviço de IA

Controllers apenas recebem dados da requisição, chamam os casos de uso e retornam a resposta, sem conter regras de negócio.

## Uso de Dados Normativos (BNCC e MEC)

Os documentos da BNCC e as Diretrizes do MEC são armazenados em arquivos JSON estáticos no backend. Esses arquivos são utilizados exclusivamente como fonte de referência para validações e sugestões automáticas no processo de geração de unidades e conteúdos didáticos.

* Não há persistência desses dados no banco de dados relacional
* Os JSONs são versionados junto ao código-fonte
* A aplicação assume que esses documentos não sofrem alterações frequentes durante o ciclo de vida do projeto

Essa abordagem reduz a complexidade do banco de dados e facilita a manutenção e auditoria das regras educacionais aplicadas.

## Consequências

### Positivas

* Arquitetura clara e fácil de explicar
* Separação adequada de responsabilidades
* Baixo custo cognitivo para desenvolvimento
* Facilidade de testes nos casos de uso
* Adequada ao contexto de hackathon e projeto acadêmico

### Negativas / Limitações

* Algumas validações são implementadas diretamente nos casos de uso, podendo gerar repetição em projetos maiores
* Arquitetura não preparada para cenários de alta complexidade ou múltiplos domínios

Essas limitações foram consideradas aceitáveis dado o escopo e o prazo do projeto.

## Considerações Finais

A arquitetura adotada prioriza clareza, rapidez de desenvolvimento e aderência ao escopo do projeto. Decisões mais complexas foram intencionalmente evitadas para reduzir risco técnico e garantir a entrega funcional da solução.
