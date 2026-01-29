# 🚀 Deploy da API no AWS Lightsail com PM2

Tutorial completo para fazer deploy da API do AI-ASSISTANT-FOR-TEACHER no AWS Lightsail.

## 📋 Pré-requisitos

- Instância Lightsail com Ubuntu/Linux já criada
- Node.js e PM2 já instalados na instância
- Acesso SSH à instância
- Git instalado na instância

## 🔧 Passo 1: Conectar na Instância

```bash
# Via SSH (substitua pelo IP da sua instância)
ssh -i sua-chave.pem ubuntu@SEU_IP_LIGHTSAIL
```

## 📦 Passo 2: Preparar o Ambiente

```bash
# Navegar para o diretório de projetos
cd /home/ubuntu

# Clonar o repositório (se ainda não estiver na instância)
git clone https://github.com/SEU_USUARIO/AI-ASSISTANT-FOR-TEACHER.git

# Ou atualizar se já existe
cd AI-ASSISTANT-FOR-TEACHER
git pull origin main

# Navegar para o backend
cd Backend
```

## ⚙️ Passo 3: Instalar Dependências

```bash
# Instalar as dependências do projeto
npm install
```

## 🔐 Passo 4: Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env na instância
nano .env
```

Adicionar as seguintes variáveis (ajuste conforme necessário):

```env
# Database
DATABASE_URL="postgresql://postgres.lyjwetupfgglunpgxokv:IA-ASSISTANT-Project@aws-1-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.lyjwetupfgglunpgxokv:IA-ASSISTANT-Project@aws-1-us-east-1.pooler.supabase.com:5432/postgres"

# OpenAI
OPENAI_API_KEY="sua-chave-openai"

# RAG Service
RAG_API_URL="http://3.228.5.64:5251"

# Frontend URL (ajustar para o domínio de produção)
FRONTEND_URL="https://seu-frontend.com"
```

**Importante:** Salvar com `Ctrl + O`, `Enter`, e sair com `Ctrl + X`

## 🗄️ Passo 5: Configurar Prisma

```bash
# Gerar o Prisma Client
npx prisma generate

# Rodar as migrations (se necessário)
npx prisma migrate deploy
```

## 🏗️ Passo 6: Fazer Build da Aplicação

```bash
# Compilar o TypeScript para JavaScript e copiar arquivos JSON
npm run build
```

Isso vai:
1. Compilar o TypeScript para JavaScript (pasta `dist/`)
2. Copiar os arquivos JSON da pasta `src/04-data/` para `dist/04-data/`

## 🚀 Passo 7: Configurar PM2

### Criar arquivo de configuração do PM2

```bash
nano ecosystem.config.js
```

Adicionar o seguinte conteúdo:

```javascript
module.exports = {
  apps: [{
    name: 'ai-assistant-api',
    script: './dist/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3131
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
```

### Criar pasta de logs

```bash
mkdir -p logs
```

### Iniciar a aplicação com PM2

```bash
# Parar qualquer processo anterior (se existir)
pm2 delete ai-assistant-api 2>/dev/null

# Iniciar a aplicação
pm2 start ecosystem.config.js

# Verificar status
pm2 status

# Ver logs
pm2 logs ai-assistant-api
```

### Comandos úteis do PM2

```bash
# Ver logs em tempo real
pm2 logs ai-assistant-api

# Parar a aplicação
pm2 stop ai-assistant-api

# Reiniciar a aplicação
pm2 restart ai-assistant-api

# Recarregar (sem downtime)
pm2 reload ai-assistant-api

# Ver informações detalhadas
pm2 info ai-assistant-api

# Monitorar recursos
pm2 monit
```

## 🔄 Passo 8: Configurar PM2 para Iniciar no Boot

```bash
# Salvar a configuração atual do PM2
pm2 save

# Configurar para iniciar automaticamente
pm2 startup

# Execute o comando que o PM2 mostrar (algo como):
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

## 🌐 Passo 9: Configurar Firewall do Lightsail

1. Acesse o painel do Lightsail
2. Vá em **Networking** da sua instância
3. Adicione uma regra de firewall:
   - **Application**: Custom
   - **Protocol**: TCP
   - **Port**: 3131
   - **Source**: 0.0.0.0/0 (ou restrinja conforme necessário)

## 🔄 Passo 10: Script de Deploy Automático

Criar um script para facilitar deploys futuros:

```bash
nano deploy.sh
```

Adicionar:

```bash
#!/bin/bash

echo "🚀 Iniciando deploy da API..."

# Puxar últimas mudanças
git pull origin main

# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Rodar migrations
npx prisma migrate deploy

# Build da aplicação
npm run build

# Reiniciar PM2
pm2 reload ai-assistant-api

echo "✅ Deploy concluído!"
echo "📊 Status da aplicação:"
pm2 status ai-assistant-api
```

Tornar executável:

```bash
chmod +x deploy.sh
```

Para fazer deploy, basta rodar:

```bash
./deploy.sh
```

## 🔍 Monitoramento e Troubleshooting

### Verificar se a API está rodando

```bash
# Testar localmente na instância
curl http://localhost:3131

# Ver processos Node.js
ps aux | grep node

# Ver uso de memória
free -h
```

### Ver logs

```bash
# Logs do PM2
pm2 logs ai-assistant-api --lines 100

# Logs de erro
pm2 logs ai-assistant-api --err

# Logs de saída
pm2 logs ai-assistant-api --out
```

### Problemas comuns

1. **Porta já em uso:**
   ```bash
   sudo lsof -i :3131
   pm2 delete all
   pm2 start ecosystem.config.js
   ```

2. **Sem memória:**
   ```bash
   pm2 restart ai-assistant-api
   # Ou verificar/aumentar recursos da instância
   ```

3. **Erro no Prisma:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

4. **Build falhou:**
   ```bash
   rm -rf dist/
   rm -rf node_modules/
   npm install
   npm run build
   ```

5. **Erro: Cannot find module 'ListarDisciplinaUseCase':**
   ```bash
   # No Linux o TypeScript é case-sensitive
   # Verifique se o tsconfig.json tem estas configurações:
   rm -rf dist/ node_modules/
   npm install
   npm run build
   ```
   
   Certifique-se que o [tsconfig.json](../tsconfig.json) tem:
   ```json
   {
     "compilerOptions": {
       "moduleResolution": "bundler",
       "forceConsistentCasingInFileNames": true,
       "skipLibCheck": true
     }
   }
   ```

## 📊 Testar a API

```bash
# Da sua máquina local
curl http://SEU_IP_LIGHTSAIL:3131

# Ou testar um endpoint específico
curl http://SEU_IP_LIGHTSAIL:3131/disciplinas
```

## 🔒 Segurança (Recomendações)

1. **Configurar NGINX como proxy reverso** (opcional mas recomendado)
2. **Adicionar SSL/HTTPS** com Let's Encrypt
3. **Restringir acesso ao firewall** apenas para IPs necessários
4. **Não commitar o arquivo .env** no Git (já está no .gitignore)
5. **Usar variáveis de ambiente seguras** para chaves sensíveis

## 🆘 Suporte

Se encontrar problemas:

1. Verificar logs: `pm2 logs ai-assistant-api`
2. Verificar status: `pm2 status`
3. Reiniciar: `pm2 restart ai-assistant-api`
4. Verificar variáveis de ambiente no .env
5. Verificar se o PostgreSQL (Supabase) está acessível

## 📝 Checklist Rápido

- [ ] Conectado na instância via SSH
- [ ] Código atualizado (git pull)
- [ ] Dependências instaladas (npm install)
- [ ] Arquivo .env configurado
- [ ] Prisma Client gerado (npx prisma generate)
- [ ] Build realizado (npm run build)
- [ ] PM2 configurado e rodando (pm2 start)
- [ ] Firewall configurado (porta 3131)
- [ ] API testada e funcionando

---

**Porta da API:** 3131  
**Comando para acessar:** `http://SEU_IP:3131`  
**Logs:** `pm2 logs ai-assistant-api`
