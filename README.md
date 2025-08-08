# Constrular System PI2

Sistema fullstack para gestão de loja de materiais de construção: cadastro de produtos, clientes, vendas/orçamentos/parcelas, movimentações de estoque, autenticação e pagamentos.

- Backend: NestJS 10 + Prisma + PostgreSQL
- Frontend: Next.js 14 (App Router) + Tailwind + React Query
- Desktop: Electron (build do frontend com Next + Electron)
- Infra: Docker Compose para DEV, Prisma Migrate/Studio
- Testes: Jest (unitários, integração e e2e) com Testcontainers
- CI/CD: GitHub Actions (testes, lint e deploy para DEV)


## Sumário
- Visão geral da arquitetura
- Módulos e principais endpoints (controllers) e regras (services)
- Banco de dados e ORM (Prisma)
- Executando em desenvolvimento (Docker)
- Executando localmente (sem Docker)
- Testes automatizados
- Documentação da API (Swagger)
- CI/CD (Workflows GitHub Actions)
- Padrões de erro e validação
- Autenticação e segurança


## Visão geral da arquitetura
Monorepo com duas aplicações principais:
- `server/` (NestJS): API REST modularizada por domínio (auth, user, customer, product, order, stock_movement). Usa Prisma para acesso ao Postgres, validação global com ValidationPipe, filtro global de exceções e Swagger.
- `web/` (Next.js + Electron): Interface web/desktop consumindo a API. Serviços HTTP em `web/src/services/*`.

Principais elementos do backend:
- `AppModule` (`server/src/app.module.ts`): agrega módulos de domínio e aplica `JwtAuthGuard` como `APP_GUARD` (toda rota privada por padrão).
- `main.ts`: pipes globais, filtro de exceção, CORS, cookies e Swagger em `/docs`.
- `HttpExceptionFilter`: padroniza resposta de erro (statusCode, error, validationErrorProperties, path, timestamp).
- `PrismaService`: inicializa conexão Prisma (PostgreSQL).


## Módulos (controllers e services)
Abaixo um resumo dos módulos focando controllers (endpoints) e services (regras principais).

### Auth
Arquivos: `auth.controller.ts`, `auth.service.ts`, `auth.module.ts`.
- POST `POST /auth/login` (pública): usa `LocalAuthGuard`, gera JWT e define cookie `session` httpOnly/secure/sameSite=none. Retorna `{ user }`.
- POST `POST /auth/logout` (pública): limpa cookie `session`.
- Service: assina JWT com payload `{ sub, username }`, mapeia usuário para DTO. Validação básica de credenciais via `UserRepository`.

Segurança global: `JwtAuthGuard` como APP_GUARD restringe acesso às rotas (utilize o decorator `@isPublic()` para liberar rotas públicas).

### Customers
Arquivos: `customer.controller.ts`, `customer.service.ts`.
- GET `/customers`: lista clientes.
- GET `/customers/:id?includeAddress=false`: busca cliente (opção `includeAddress`).
- POST `/customers`: cria cliente (nome obrigatório e único).
- PUT `/customers/:id`: atualiza cliente (nome obrigatório).
- PUT `/customers/:id/balance`: atualiza saldo do cliente (suporta transação Prisma via parâmetro opcional `tx`).
- DELETE `/customers/:id`: remove cliente.

Service: valida nome, verifica existência/duplicidade, delega a `CustomerRepository` (interface) para persistência.

### Products
Arquivos: `product.controller.ts`, `product.service.ts`, `product.repository.ts`.
- GET `/products`: lista produtos.
- GET `/products/:id`: busca produto por id.
- POST `/products`: cria produto. Swagger documenta corpo (`CreateProductDto`).
- PUT `/products/:id`: atualiza produto. Verifica duplicidade de nome e valida campos.
- DELETE `/products/:id`: impede exclusão se houver histórico de vendas (consulta `orderService.getOrdersByProductId`).

Service:
- Valida presença de campos em criação; em atualização valida apenas fornecidos.
- Proíbe números negativos para propriedades numéricas.
- Mapeia BigInt/Decimal do Prisma para `number` no DTO.
- Lança `AppException` com status apropriado; erros caem no `HttpExceptionFilter`.

Repository (Prisma): CRUD e consultas por nome com `contains` insensitive.

### Orders
Arquivos: `order.controller.ts`, `order.service.ts` + estratégias em `strategies/*`.
- GET `/orders`: lista pedidos (filtros via `FindOrderOptionsDto`).
- GET `/orders/:id`: detalhes do pedido (opções de inclusão via query).
- GET `/orders/customer/:id`: pedidos por cliente.
- POST `/orders`: cria pedido selecionando a estratégia pelo `type` (ex.: Quote, Sale, Installment).
- PUT `/orders/:id`: atualiza pedido via estratégia do `type` informado.
- PUT `/orders/:id/notes`: atualiza observações.
- DELETE `/orders/:id`: remove pedido (usa estratégia `INSTALLMENT`).
- Pagamentos (temporário neste controller):
  - POST `/orders/:id/payments`: adiciona pagamento, impede exceder total, pode marcar pedido como `COMPLETED` e `paid=true`.
  - DELETE `/orders/:orderId/payments/:paymentId`: remove pagamento; se deixar de estar totalmente pago e status era `COMPLETED`, volta para `OPEN` e `paid=false`.

Service:
- Seleciona a `OrderStrategy` por `type` para criar/atualizar/deletar.
- Integra com `CustomerService` e `PaymentService`.
- Regras de pagamento: cálculo do total pago, troco, status e flag `isPaid`.

### Stock Movements
Arquivos: `stock_movement.controller.ts`, `stock_movement.service.ts`.
- GET `/stock_movements?type=IN|OUT`: lista movimentações (filtro por tipo).
- GET `/stock_movements/:id`: detalhe.
- POST `/stock_movements`: cria movimentação de estoque (IN/OUT).
  - Regra: para `OUT` descrição é obrigatória.
  - Usa transação Prisma para atualizar estoque de cada item; impede saída se não houver estoque suficiente.
- DELETE `/stock_movements/:id`: ainda não implementado no service.

Service: consulta produto dentro da transação, calcula novo estoque e persiste. Mapeamento para DTO via `StockMovementMapper`.


## Banco de dados e ORM (Prisma)
- Banco: PostgreSQL.
- Migrations em `server/prisma/migrations`.
- Seed (`server/prisma/seed.ts`): cria usuário admin (username `admin`, senha `123`, role `ADMINISTRATOR`).
- `start.sh` (usado no Docker): aguarda DB, aplica `migrate deploy` (ou `migrate dev` se não houver migrations), gera Prisma Client, roda seed e abre Prisma Studio em `:5555`.


## Executando em desenvolvimento (Docker)
Pré‑requisitos: Docker e Docker Compose.

Comando (na raiz do repositório):

```powershell
# Sobe Postgres, Backend (Nest) e Frontend (Next)
docker compose up --build
```

Serviços e portas:
- Backend (Nest): http://localhost:3001
- Swagger: http://localhost:3001/docs
- Prisma Studio: http://localhost:5555
- Frontend (Next): http://localhost:3000

Variáveis relevantes (já definidas no compose):
- `DATABASE_URL=postgresql://postgres:secret@db:5432/pdv_db`
- `JWT_SECRET=secret`
- `NODE_ENV=development`


## Executando localmente (sem Docker)
Backend:
```powershell
cd server
npm install
$env:JWT_SECRET="secret"; npm run start:dev
```
Banco de dados: configure `DATABASE_URL` em um `.env` ou no ambiente apontando para um Postgres local.

Frontend:
```powershell
cd web
npm install
npm run next:dev
```


## Testes automatizados
No backend (`server/`):
- Scripts (`package.json`):
  - `npm run test` (gera Prisma Client e roda Jest)
  - `npm run test:e2e`
  - `npm run test:cov`
- Integração/E2E usam Testcontainers: sobem um Postgres efêmero, aplicam migrations (`npx prisma migrate reset --force`) e executam cenários reais com Prisma Client.
- Exemplos:
  - `test/product/*.spec.ts`: CRUD de produtos, validações, bloqueio de exclusão com histórico de vendas.
  - `test/orders/orders.controller.integration.spec.ts`: cenários de venda/estoque/pagamento usando módulos reais.
  - `test/stock_movement/*.spec.ts`: regras de movimentação IN/OUT e validações.

No frontend (`web/`):
- `npm run next:lint` e `npm run next:build` executados no CI (não há testes unitários configurados por padrão).


## Documentação da API (Swagger)
- Disponível em `http://localhost:3001/docs`.
- Configurado em `main.ts` com título “Soficit API” e tag “Constrular System”.
- Endpoints possuem anotações (`@ApiOperation`, `@ApiResponse`, `@ApiBody`, etc.) principalmente no módulo de produtos e movimentações.


## CI/CD (GitHub Actions)
Workflows em `.github/workflows/`:

- `TEST_PR_TO_STAGE.yml` (pull_request -> dev)
  - Backend: install, `npm run test`, `npm run test:e2e`, `npm run lint`.
  - Frontend: install, `npm run next:lint`, `npm run next:build`.

- `CI_CD_STAGE.yml` (push -> dev)
  - Executa os mesmos testes do PR.
  - Deploy Backend (DEV): dispara hook do Render (`RENDER_DEPLOY_HOOK_URL`).
  - Deploy Frontend (DEV): build e deploy para Netlify (usa `NETLIFY_SITE_ID` e `NETLIFY_AUTH_TOKEN`).

Secrets esperados:
- `DATABASE_URL_TEST`, `JWT_SECRET`, `RENDER_DEPLOY_HOOK_URL`, `NETLIFY_SITE_ID`, `NETLIFY_AUTH_TOKEN`.


## Padrões de erro e validação
- ValidationPipe global com transformação ativa.
- Exceções de domínio usam `AppException` (contém `status` e `validationErrorProperties`).
- `HttpExceptionFilter` intercepta e retorna:
  ```json
  {
    "statusCode": 400,
    "error": "Mensagem ou objeto",
    "validationErrorProperties": ["campo1", "campo2"],
    "path": "/rota",
    "timestamp": "..."
  }
  ```


## Autenticação e segurança
- JWT via `@nestjs/jwt`.
- Guard global `JwtAuthGuard` (definido como `APP_GUARD` em `AppModule`).
- Login define cookie `session` httpOnly/secure/sameSite=none.
- Use `@isPublic()` para liberar rotas (ex.: `/auth/login`, `/auth/logout`).
- CORS habilitado para origens: `http://localhost:3000`, `http://localhost:3002`, `https://constrularfront.netlify.app` com `credentials: true`.


## Estrutura de pastas (resumo)
- `server/src/modules/*`: domínios (auth, customer, user, product, order, stock_movement) com controllers, services, repositories, dtos, mappers, strategies.
- `server/prisma/*`: schema, migrations e seed.
- `web/src/*`: componentes, hooks, validações (Zod), serviços HTTP (Axios em `web/src/lib/axios`).
- `docker-compose.yml`: ambiente de desenvolvimento completo (db, backend, frontend, prisma studio).


## Credenciais iniciais
- Usuário admin criado no seed: `admin` / `123`.


## Licença
Consulte o arquivo `LICENSE` na raiz do projeto.