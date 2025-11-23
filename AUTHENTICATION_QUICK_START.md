# Guia Rápido de Autenticação - Constrular System

## 🎯 Resumo Executivo

O Constrular System usa **JWT + Cookies HTTP-only** para autenticação. Todas as rotas são protegidas por padrão, exceto as marcadas com `@isPublic()`.

## 🏗️ Arquitetura Simplificada

```
Login → LocalStrategy → JWT gerado → Cookie HTTP-only
                                            ↓
Requisição → JwtAuthGuard → JwtStrategy → Valida JWT → Controller
```

## 📦 Componentes Principais

### 1. AuthModule
Configura JWT com expiração de 30 dias e registra todas as estratégias.

### 2. AuthService
- `validate()`: Valida credenciais (⚠️ atualmente sem hash de senha)
- `login()`: Gera JWT e retorna dados do usuário

### 3. LocalStrategy
Valida username e password no momento do login.

### 4. JwtStrategy
Extrai JWT do cookie `session` e valida em cada requisição.

### 5. JwtAuthGuard (Global)
Protege todas as rotas automaticamente, exceto rotas com `@isPublic()`.

### 6. Decorators
- `@isPublic()`: Marca rota como pública
- `@CurrentUserId()`: Extrai ID do usuário autenticado

## 🔑 Endpoints de Autenticação

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123"
}
```

**Resposta:**
```json
{
  "user": {
    "id": 1,
    "name": "Administrador",
    "username": "admin",
    "role": "ADMINISTRATOR"
  }
}
```

Cookie definido: `session=eyJhbGc...` (HTTP-only, Secure, SameSite=None)

### Logout
```http
POST /auth/logout
```

Cookie `session` é limpo.

## 👥 Sistema de Roles

### Roles Disponíveis
- `ADMINISTRATOR`: Acesso total
- `SELLER`: Acesso limitado

### Modelo de Usuário (Prisma)
```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  username String @unique
  password String
  role     String @default("SELLER")
  
  Order Order[]
  
  @@map("users")
}
```

## 🔐 Como Proteger Rotas

### Rota Pública
```typescript
@isPublic()
@Get('public-info')
getPublicInfo() {
  return { message: 'Accessible to everyone' };
}
```

### Rota Protegida (padrão)
```typescript
@Get('products')
getProducts(@CurrentUserId() userId: number) {
  // userId do usuário autenticado
  return this.productService.findAll();
}
```

### Implementar Controle por Role (Próximo Passo)

1. Criar RolesGuard:
```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private userRepository: UserRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const userId = context.switchToHttp().getRequest().user;
    const user = await this.userRepository.findById(userId);
    
    return requiredRoles.includes(user.role);
  }
}
```

2. Criar decorator:
```typescript
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

3. Usar no controller:
```typescript
@Delete('products/:id')
@Roles('ADMINISTRATOR')
deleteProduct(@Param('id') id: string) {
  return this.productService.remove(+id);
}
```

## ⚠️ Vulnerabilidades Críticas

### 1. **Senha em Texto Plano**
**Problema:** `auth.service.ts` linha 38
```typescript
if (user && password === user.password) {  // ❌ INSEGURO
  return user.id;
}
```

**Solução:**
```typescript
import * as bcrypt from 'bcrypt';

// Ao criar usuário
const hashedPassword = await bcrypt.hash(password, 10);

// Ao validar
const isValid = await bcrypt.compare(password, user.password);
if (user && isValid) {
  return user.id;
}
```

### 2. **JWT_SECRET Fraco**
Use uma chave forte em produção:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Sem Rate Limiting**
Adicione proteção contra brute force no endpoint de login.

## 🚀 Comandos Rápidos

```bash
# Instalar dependências
cd server && npm install

# Criar banco e seed
npx prisma migrate dev
npx prisma db seed

# Iniciar servidor
npm run start:dev

# Acessar
# Backend: http://localhost:3001
# Swagger: http://localhost:3001/docs
# Login padrão: admin / 123
```

## 📝 Fluxo de Implementação em Novo Sistema

1. ✅ Instalar: `@nestjs/jwt`, `@nestjs/passport`, `passport-local`, `passport-jwt`, `bcrypt`, `cookie-parser`
2. ✅ Criar modelo User no Prisma
3. ✅ Criar DTOs (LoginDto, PayloadDto, RegisterDto)
4. ✅ Implementar UserRepository
5. ✅ Implementar AuthService (com bcrypt!)
6. ✅ Criar LocalStrategy
7. ✅ Criar JwtStrategy
8. ✅ Criar Guards (LocalAuthGuard, JwtAuthGuard)
9. ✅ Criar Decorators (@isPublic, @CurrentUserId)
10. ✅ Criar AuthController
11. ✅ Configurar AuthModule
12. ✅ Configurar guard global no AppModule
13. ✅ Configurar cookies no main.ts
14. ✅ Testar!

## 🔗 Recursos

- **Guia Completo:** `AUTHENTICATION_GUIDE.md`
- **Swagger:** http://localhost:3001/docs
- **README:** Seção "Autenticação e segurança"

---

**Nota:** Para uma compreensão mais profunda e exemplos detalhados, consulte o `AUTHENTICATION_GUIDE.md`.
