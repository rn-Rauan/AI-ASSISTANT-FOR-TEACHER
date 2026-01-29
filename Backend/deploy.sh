#!/bin/bash

echo "🚀 Iniciando deploy da API AI-ASSISTANT-FOR-TEACHER..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script no diretório Backend/"
    exit 1
fi

echo "${YELLOW}📥 Puxando últimas mudanças do Git...${NC}"
git pull origin main
if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer git pull"
    exit 1
fi

echo ""
echo "${YELLOW}📦 Instalando dependências...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""
echo "${YELLOW}🗄️  Gerando Prisma Client...${NC}"
npx prisma generate
if [ $? -ne 0 ]; then
    echo "❌ Erro ao gerar Prisma Client"
    exit 1
fi

echo ""
echo "${YELLOW}🔄 Aplicando migrations do banco de dados...${NC}"
npx prisma migrate deploy
if [ $? -ne 0 ]; then
    echo "⚠️  Aviso: Erro ao aplicar migrations (pode ser normal se não houver migrations pendentes)"
fi

echo ""
echo "${YELLOW}🏗️  Fazendo build da aplicação...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro ao fazer build"
    echo "💡 Tente: rm -rf dist/ node_modules/ && npm install && npm run build"
    exit 1
fi

echo ""
echo "${YELLOW}🔄 Reiniciando aplicação no PM2...${NC}"
pm2 reload ai-assistant-api
if [ $? -ne 0 ]; then
    echo "⚠️  Aplicação não estava rodando. Iniciando..."
    pm2 start ecosystem.config.js
fi

echo ""
echo "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "📊 Status da aplicação:"
pm2 status ai-assistant-api
echo ""
echo "📝 Para ver os logs: pm2 logs ai-assistant-api"
echo "🔍 Para monitorar: pm2 monit"
