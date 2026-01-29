# 🚀 Relatório: Deploy da API no AWS Lightsail

**Projeto:** AI-ASSISTANT-FOR-TEACHER  
**Plataforma:** AWS Lightsail  
**Data:** 29 de janeiro de 2026

---

## 📊 Visão Geral do Processo

Este relatório documenta o processo completo de deploy de uma API Node.js/TypeScript em produção, detalhando cada etapa, ferramentas utilizadas e suas finalidades.

---

## 🎯 Objetivo

Colocar a API REST do projeto em ambiente de produção, garantindo:
- ✅ Alta disponibilidade (24/7)
- ✅ Reinicialização automática em caso de falhas
- ✅ Logs para monitoramento
- ✅ Gerenciamento eficiente de recursos

---

## 🛠️ Tecnologias e Ferramentas Utilizadas

### 1. **AWS Lightsail**
- **O que é:** Serviço de servidor virtual (VPS) da Amazon
- **Para que serve:** Hospedar a aplicação em um servidor na nuvem
- **Por que usar:** Simples, econômico e escalável

### 2. **Ubuntu Linux**
- **O que é:** Sistema operacional do servidor
- **Para que serve:** Ambiente onde a aplicação será executada
- **Por que usar:** Estável, seguro e amplamente usado em produção

### 3. **Node.js**
- **O que é:** Runtime JavaScript/TypeScript
- **Para que serve:** Executar o código da API
- **Versão requerida:** 18+ (LTS recomendado)

### 4. **PM2 (Process Manager 2)**
- **O que é:** Gerenciador de processos para Node.js
- **Para que serve:** 
  - Manter a aplicação rodando 24/7
  - Reiniciar automaticamente em caso de crash
  - Gerenciar logs
  - Monitorar recursos (CPU, memória)
- **Por que usar:** Essencial para ambientes de produção

### 5. **Git**
- **O que é:** Sistema de controle de versão
- **Para que serve:** Baixar e atualizar o código no servidor
- **Por que usar:** Facilita deploys e atualizações

### 6. **PostgreSQL (Supabase)**
- **O que é:** Banco de dados relacional hospedado
- **Para que serve:** Armazenar dados da aplicação
- **Por que usar:** Gerenciado, sem necessidade de manutenção do banco

### 7. **Prisma ORM**
- **O que é:** ORM (Object-Relational Mapping) para TypeScript
- **Para que serve:** Comunicação entre a API e o banco de dados
- **Por que usar:** Type-safe, migrations automáticas

---

## 📋 Pré-requisitos Configurados

Antes de iniciar o deploy, o ambiente já possuía:
- ✅ Instância Lightsail criada e rodando Ubuntu
- ✅ Node.js instalado
- ✅ PM2 instalado globalmente
- ✅ Git instalado
- ✅ Acesso SSH configurado

---

## 🔄 Fluxo do Deploy - Passo a Passo

### **FASE 1: Acesso ao Servidor**

#### Passo 1.1 - Conexão SSH
```bash
ssh -i sua-chave.pem ubuntu@SEU_IP_LIGHTSAIL
```
**O que faz:** Conecta via terminal no servidor remoto  
**Por que:** Precisamos acessar o servidor para executar comandos

---

### **FASE 2: Preparação do Código**

#### Passo 2.1 - Clonar/Atualizar Repositório
```bash
cd /home/ubuntu
git clone https://github.com/SEU_USUARIO/AI-ASSISTANT-FOR-TEACHER.git
# OU
git pull origin main  # se já existe
```
**O que faz:** Baixa ou atualiza o código do GitHub para o servidor  
**Por que:** Precisamos do código fonte no servidor  
**Resultado:** Pasta com todo o código do projeto

#### Passo 2.2 - Navegar para o Backend
```bash
cd AI-ASSISTANT-FOR-TEACHER/Backend
```
**O que faz:** Entra na pasta da API  
**Por que:** Comandos devem ser executados na pasta correta

---

### **FASE 3: Instalação de Dependências**

#### Passo 3.1 - Instalar Pacotes NPM
```bash
npm install
```
**O que faz:** Baixa todas as bibliotecas que o projeto usa  
**O que é baixado:**
- Express (framework web)
- Prisma (ORM para banco de dados)
- TypeScript (linguagem)
- Jest (testes)
- Zod (validação)
- E outras 50+ dependências

**Por que:** O código precisa dessas bibliotecas para funcionar  
**Tempo estimado:** 2-5 minutos  
**Resultado:** Pasta `node_modules/` criada com ~200MB

---

### **FASE 4: Configuração de Ambiente**

#### Passo 4.1 - Criar Arquivo .env
```bash
nano .env
```
**O que faz:** Cria arquivo com variáveis secretas  
**Conteúdo necessário:**
```env
DATABASE_URL="postgresql://..."          # Conexão com banco
DIRECT_URL="postgresql://..."            # Conexão direta
OPENAI_API_KEY="sk-..."                  # Chave da OpenAI
RAG_API_URL="http://3.228.5.64:5251"    # API do sistema RAG
FRONTEND_URL="https://seu-frontend.com"  # URL do site
```

**Por que:** Guardar informações sensíveis fora do código  
**Segurança:** Nunca deve ser commitado no Git

---

### **FASE 5: Configuração do Banco de Dados**

#### Passo 5.1 - Gerar Prisma Client
```bash
npx prisma generate
```
**O que faz:** Cria código TypeScript baseado no schema do banco  
**O que é gerado:**
- Cliente tipado para acessar o banco
- Interfaces TypeScript
- Funções CRUD (Create, Read, Update, Delete)

**Por que:** Permite usar o banco com segurança de tipos  
**Resultado:** Código gerado em `node_modules/.prisma/client/`

#### Passo 5.2 - Rodar Migrations
```bash
npx prisma migrate deploy
```
**O que faz:** Cria/atualiza tabelas no banco de dados  
**Migrations aplicadas:**
- Cria tabelas: Disciplina, Unidade, ConteudoGerado
- Define relacionamentos
- Cria índices

**Por que:** Garantir que o banco tem a estrutura correta  
**Segurança:** Apenas aplica, não modifica migrations existentes

---

### **FASE 6: Compilação do Código**

#### Passo 6.1 - Build da Aplicação
```bash
npm run build
```
**O que faz:**
1. Compila TypeScript → JavaScript
2. Copia arquivos JSON necessários

**Processo:**
- `tsc` compila `.ts` para `.js`
- `node copy-data.js` copia arquivos de `src/04-data/` para `dist/04-data/`

**Arquivos copiados:**
- `diretrizes_mec.json` (diretrizes educacionais)
- `mapDisciplinaAnoSerie.json` (mapeamento de disciplinas)

**Por que:** Node.js só executa JavaScript, não TypeScript  
**Tempo estimado:** 30-60 segundos  
**Resultado:** Pasta `dist/` criada com código compilado

---

### **FASE 7: Iniciar com PM2**

#### Passo 7.1 - Iniciar Aplicação Diretamente
```bash
pm2 start dist/server.js --name ai-assistant-api
```
**O que faz:** Inicia a API com PM2 usando configurações padrão  
**Parâmetros:**
- `dist/server.js` - Arquivo JavaScript compilado a ser executado
- `--name ai-assistant-api` - Nome identificador do processo no PM2

**Resultado:**
- ✅ API rodando na porta 3131
- ✅ Processo monitorado automaticamente pelo PM2
- ✅ Reinicialização automática em caso de crash (padrão do PM2)
- ✅ Logs capturados pelo PM2

**Verificar status:**
```bash
pm2 status                # Ver se está rodando
pm2 logs ai-assistant-api # Ver logs em tempo real
pm2 info ai-assistant-api # Informações detalhadas
```

**Configurações automáticas do PM2 (padrão):**
- Auto-restart ativado
- Modo fork (single instance)
- Logs em `~/.pm2/logs/`
- Variáveis de ambiente do sistema (.env é carregado pela aplicação)

---

### **FASE 8: Configuração de Auto-Start**

#### Passo 8.1 - Salvar Configuração PM2
```bash
pm2 save
```
**O que faz:** Salva lista atual de processos  
**Por que:** PM2 precisa saber quais apps iniciar no boot

#### Passo 8.2 - Configurar Startup
```bash
pm2 startup
```
**O que faz:** Configura PM2 para iniciar com o sistema  
**Resultado:** Se o servidor reiniciar, a API volta automaticamente  
**Por que:** Garante disponibilidade 24/7

---

### **FASE 9: Configuração de Rede**

#### Passo 9.1 - Liberar Porta no Firewall
**Local:** Painel do AWS Lightsail  
**Configuração:**
- Protocol: TCP
- Port: 3131
- Source: 0.0.0.0/0 (todo mundo)

**O que faz:** Permite que a internet acesse a API  
**Por que:** Sem isso, ninguém consegue acessar a API  
**Segurança:** Pode restringir IPs específicos se necessário

---

### **FASE 10: Automação de Deploys Futuros**

#### Passo 10.1 - Criar Script de Deploy
```bash
nano deploy.sh
```
**Conteúdo do script:**
```bash
#!/bin/bash
git pull origin main      # Atualiza código
npm install              # Instala dependências
npx prisma generate      # Gera Prisma Client
npx prisma migrate deploy # Aplica migrations
npm run build           # Compila código
pm2 reload ai-assistant-api # Reinicia sem downtime
```

**Por que:** Simplifica deploys futuros em um único comando  
**Uso:** `./deploy.sh`

---

## 📊 Comandos Úteis do PM2

### Monitoramento
```bash
pm2 status              # Status de todos os processos
pm2 logs ai-assistant-api # Ver logs em tempo real
pm2 monit              # Monitor visual de recursos
pm2 info ai-assistant-api # Informações detalhadas
```

### Controle
```bash
pm2 restart ai-assistant-api # Restart com downtime
pm2 reload ai-assistant-api  # Restart sem downtime
pm2 stop ai-assistant-api    # Parar aplicação
pm2 delete ai-assistant-api  # Remover do PM2
```

---

## ✅ Checklist de Deploy Completo

### Preparação
- [x] Servidor Lightsail criado e acessível
- [x] Node.js instalado (v18+)
- [x] PM2 instalado globalmente
- [x] Git instalado

### Configuração
- [x] Código clonado/atualizado do GitHub
- [x] Dependências instaladas (`npm install`)
- [x] Arquivo `.env` criado com todas variáveis
- [x] Prisma Client gerado
- [x] Migrations aplicadas

### Build e Deploy
- [x] Código compilado (`npm run build`)
- [x] Pasta `dist/` criada
- [x] Arquivos JSON copiados
- [x] Aplicação iniciada com PM2 (`pm2 start dist/server.js --name ai-assistant-api`)

### Infraestrutura
- [x] Porta 3131 liberada no firewall
- [x] PM2 configurado para auto-start
- [x] Script de deploy criado
- [x] Logs configurados e funcionando

### Validação
- [x] API respondendo: `curl http://SEU_IP:3131`
- [x] PM2 mostrando status "online"
- [x] Logs sem erros críticos
- [x] Banco de dados conectado

---

## 🎯 Resultado Final

### API em Produção
- **URL:** `http://SEU_IP:3131`
- **Status:** Online 24/7
- **Monitoramento:** PM2
- **Logs:** `/home/ubuntu/AI-ASSISTANT-FOR-TEACHER/Backend/logs/`

### Recursos Utilizados
| Recurso | Quantidade | Finalidade |
|---------|-----------|-----------|
| CPU | ~5-10% | Processar requisições |
| RAM | ~200-300MB | Executar aplicação |
| Disco | ~500MB | Código + node_modules |
| Porta | 3131 | Receber requisições HTTP |

### Funcionalidades Ativas
- ✅ API REST rodando
- ✅ Conexão com PostgreSQL (Supabase)
- ✅ Integração com OpenAI
- ✅ Sistema RAG funcionando
- ✅ Reinicialização automática
- ✅ Logs persistentes

---

## 🔍 Troubleshooting - Problemas Comuns

### 1. Porta já em uso
**Problema:** `Error: listen EADDRINUSE :::3131`  
**Solução:**
```bash
sudo lsof -i :3131  # Ver processo usando a porta
pm2 delete all      # Parar todos processos PM2
pm2 start ecosystem.config.js
```

### 2. Erro de módulo não encontrado
**Problema:** `Cannot find module 'ListarDisciplinaUseCase'`  
**Causa:** Linux é case-sensitive  
**Solução:**
```bash
rm -rf dist/ node_modules/
npm install
npm run build
```

### 3. Prisma não conecta
**Problema:** `PrismaClientInitializationError`  
**Solução:**
```bash
npx prisma generate
npx prisma migrate deploy
pm2 restart ai-assistant-api
```

### 4. Memória insuficiente
**Problema:** Aplicação trava ou reinicia muito  
**Solução:**
- Verificar: `free -h`
- Aumentar recursos da instância Lightsail
- Ou configurar limite de memória: `pm2 start dist/server.js --name ai-assistant-api --max-memory-restart 500M`

### 5. Build falha
**Problema:** Erros de TypeScript na compilação  
**Solução:**
```bash
rm -rf dist/
npm run build
# Verificar erros específicos e corrigir
```

---

## 📈 Métricas e Performance

### Tempo Total de Deploy
- **Primeira vez:** ~10-15 minutos
- **Deploys futuros:** ~2-3 minutos (com script)

### Recursos Consumidos
- **Download inicial:** ~200MB (node_modules)
- **Build:** ~30-60 segundos
- **Startup:** ~5-10 segundos

### Disponibilidade
- **Uptime esperado:** 99.9%
- **Downtime em deploys:** 0 segundos (com pm2 reload)

---

## 🔒 Recomendações de Segurança

### Implementadas
✅ Variáveis sensíveis em `.env` (não no código)  
✅ `.env` no `.gitignore`  
✅ PM2 executando como usuário não-root  

### Recomendadas para Futuro
- [ ] Adicionar NGINX como proxy reverso
- [ ] Configurar SSL/HTTPS com Let's Encrypt
- [ ] Restringir firewall para IPs específicos
- [ ] Implementar rate limiting
- [ ] Adicionar autenticação JWT

---

## 📚 Documentação Adicional

### Arquivos de Referência
- [API_DOCS.md](API_DOCS.md) - Documentação completa da API
- [schema.prisma](../prisma/schema.prisma) - Esquema do banco de dados
- [package.json](../package.json) - Dependências do projeto
- [tsconfig.json](../tsconfig.json) - Configuração TypeScript

### Links Úteis
- **PM2 Docs:** https://pm2.keymetrics.io/docs/
- **Prisma Docs:** https://www.prisma.io/docs/
- **AWS Lightsail:** https://lightsail.aws.amazon.com/

---

## 📝 Notas Finais

Este deploy estabelece uma base sólida para produção com:
- ✅ Código compilado e otimizado
- ✅ Gerenciamento robusto de processos
- ✅ Monitoramento e logs
- ✅ Recuperação automática de falhas
- ✅ Facilidade para deploys futuros

**Próximos passos recomendados:**
1. Configurar domínio personalizado
2. Adicionar SSL/HTTPS
3. Implementar CI/CD
4. Configurar backup automático do banco
5. Adicionar monitoring avançado (DataDog, New Relic, etc.)

---

**Deploy realizado com sucesso! 🎉**


