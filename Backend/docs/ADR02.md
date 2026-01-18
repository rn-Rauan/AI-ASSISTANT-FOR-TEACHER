# ADR-02: Arquitetura de APIs Desacopladas com LlamaIndex para RAG

## Status

Aceito

## Data: 18/01/2026

18/01/2026

## Decisão Técnica: Separação da camada de Recuperação (LlamaIndex) e Camada de Orquestração (API Central).

## Contexto
O edital exige que a aplicação utilize técnicas de RAG (Retrieval-Augmented Generation) para consultar a BNCC e diretrizes do MEC . Para garantir uma implementação de alta performance e seguir padrões de mercado na manipulação de vetores e documentos, optamos por utilizar o framework LlamaIndex.

### Decisão
Decidimos utilizar o template padrão do LlamaIndex (create-llama) como um serviço de API especializado em RAG, mantendo-o separado da nossa API Central.

A divisão de responsabilidades foi definida da seguinte forma:

**API de RAG (LlamaIndex)**: Atua como o motor de busca vetorial. Ela indexa o PDF da BNCC e fornece um endpoint que recebe o "Tema" e retorna os trechos (nodes) técnicos mais relevantes.

**API Central (Backend)**: Atua como a orquestradora. Ela gerencia o estado da aplicação, recebe o contexto criativo do professor (ex: "balde enchendo"), consome os dados da API de RAG e realiza a chamada final para o modelo de linguagem (LLM).

### Justificativa
Padronização Técnica: O uso do create-llama garante uma estrutura de indexação e recuperação testada e otimizada, reduzindo erros de busca.

Isolamento de Ruído: Ao enviar apenas o "Tema" para a API de RAG e deixar o "Contexto do Professor" apenas para a API Central, evitamos que termos lúdicos (contexto) confundam a busca técnica nos documentos oficiais.

Modularidade: Esta arquitetura permite que a parte de "inteligência de busca" possa evoluir independentemente da interface do usuário.

### Consequências
Positivas: * Fácil integração com ferramentas de monitoramento de busca.

Garantia de que os documentos recuperados são estritamente relacionados ao tema pedagógico.

Atendimento pleno aos requisitos arquiteturais do Hackathon .

Negativas: * Necessidade de gerenciar dois ambientes de API simultaneamente.