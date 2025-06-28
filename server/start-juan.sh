#!/bin/sh

set -e # Interrompe o script em caso de erro

# Verifica se o comando nc está disponível
if ! command -v nc >/dev/null 2>&1; then
  echo "❌ O comando 'nc' (Netcat) não está disponível. Certifique-se de que ele está instalado."
  exit 1
fi

MAX_WAIT_SECONDS=180 # 3 minutos
WAIT_INTERVAL_SECONDS=5
SECONDS_WAITED=0

# Espera o Postgres estar disponível
until nc -z ${DATABASE_HOST:-postgres-pi2} ${DATABASE_PORT:-5432} ; do
  echo "⏳ Aguardando o Banco no host ${DATABASE_HOST:-postgres-pi2} na porta ${DATABASE_PORT:-5432} ficar disponível..."
  sleep $WAIT_INTERVAL_SECONDS
  SECONDS_WAITED=$((SECONDS_WAITED + WAIT_INTERVAL_SECONDS))
  if [ $SECONDS_WAITED -ge $MAX_WAIT_SECONDS ]; then
    echo "❌ Tempo limite excedido ($MAX_WAIT_SECONDS segundos). O banco de dados não ficou disponível."
    exit 1
  fi
done

echo "✅ PostgreSQL está pronto, iniciando a aplicação..."

# Verifica se a pasta de migrations já existe
if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations)" ]; then
  echo "📁 Migrations já existem, pulando criação e aplicando migrations..."
  npx prisma migrate deploy
else
  echo "🚀 Nenhuma migration encontrada, executando 'prisma migrate dev --name init'..."
  npx prisma migrate dev --name init
fi

# Gera os clients do Prisma
echo "⏳ Gerando Prisma Client..."
npx prisma generate

# Executa o seed para criar o usuário admin
echo "⏳ Criando Usuário Admin..."
npm run prisma:seed

# Inicia o Prisma Studio em background
echo "⏳ Iniciando Prisma Studio em background na porta 5555..."
npx prisma studio --port 5555 &

# Inicia a aplicação
echo "⏳ Iniciando Backend..."
npm run start:dev