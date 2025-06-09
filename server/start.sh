#!/bin/sh

set -e # Interrompe o script em caso de erro

# Verifica se o comando nc está disponível
if ! command -v nc >/dev/null 2>&1; then
  echo "❌ O comando 'nc' (Netcat) não está disponível. Certifique-se de que ele está instalado."
  exit 1
fi

# Espera o Postgres estar disponível
until nc -z db 5432; do
  echo "⏳ Aguardando o PostgreSQL ficar disponível..."
  sleep 1
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

# Inicia o Prisma Studio
echo "⏳ Iniciando Prisma Studio..."
npx prisma studio --port 5555

# Inicia a aplicação
echo "⏳ Iniciando Backend..."
npm run start:dev