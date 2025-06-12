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

echo "⏳ Criando Usuário Admin..."
npm run prisma:seed

# Gera os clients do Prisma
echo "⏳ Gerando Prisma Client..."
npx prisma generate

# Inicia o Prisma Studio
echo "⏳ Iniciando Prisma Studio..."
npx prisma studio --port 5555 &

# Inicia a aplicação
echo "⏳ Iniciando Backend..."
npm run start:dev