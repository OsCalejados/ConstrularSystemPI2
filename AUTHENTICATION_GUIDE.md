# Guia Completo de Autenticação - Constrular System

## 📋 Sumário
1. [Visão Geral da Autenticação](#visão-geral-da-autenticação)
2. [Como Funciona a Autenticação Atual](#como-funciona-a-autenticação-atual)
3. [Componentes do Sistema](#componentes-do-sistema)
4. [Fluxo de Autenticação](#fluxo-de-autenticação)
5. [Implementação do Zero](#implementação-do-zero)
6. [Sistema com Múltiplos Tipos de Usuários](#sistema-com-múltiplos-tipos-de-usuários)
7. [Segurança e Boas Práticas](#segurança-e-boas-práticas)

---

## 🎯 Visão Geral da Autenticação

O sistema Constrular utiliza autenticação baseada em **JWT (JSON Web Token)** com **cookies HTTP-only** para gerenciar sessões de usuários. A implementação é feita com NestJS e Passport, oferecendo uma solução robusta e segura.

### Características Principais:
- ✅ Autenticação JWT com cookies HTTP-only
- ✅ Proteção global de rotas (todas as rotas são privadas por padrão)
- ✅ Suporte a múltiplos tipos de usuários (roles: ADMINISTRATOR, SELLER)
- ✅ Sessões de 30 dias
- ✅ Estratégias Local e JWT do Passport
- ✅ Guards customizados para controle de acesso

---

## 🔍 Como Funciona a Autenticação Atual

### Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                         Cliente                              │
│  (Frontend - Next.js ou aplicação externa)                  │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ POST /auth/login (username, password)
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    AuthController                            │
│  - Recebe credenciais                                        │
│  - Usa LocalAuthGuard                                        │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Valida credenciais
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   LocalStrategy                              │
│  - Chama AuthService.validate()                              │
│  - Verifica username e password                              │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Credenciais válidas (retorna userId)
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    AuthService                               │
│  - Gera JWT com payload {sub: userId, username}             │
│  - Retorna token e dados do usuário                         │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Define cookie HTTP-only
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Response                                  │
│  - Cookie "session" com JWT                                  │
│  - Body: { user: { id, name, username, role } }            │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Requisições Protegidas

```
┌─────────────────────────────────────────────────────────────┐
│                     Cliente faz requisição                   │
│  GET /products (com cookie "session")                       │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Cookie contém JWT
               ▼
┌─────────────────────────────────────────────────────────────┐
│                   JwtAuthGuard (Global)                      │
│  - Verifica se rota é pública (@isPublic)                   │
│  - Se não for pública, valida JWT                           │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ Extrai e valida JWT
               ▼
┌─────────────────────────────────────────────────────────────┐
│                     JwtStrategy                              │
│  - Extrai JWT do cookie "session"                           │
│  - Valida assinatura e expiração                            │
│  - Retorna userId do payload                                │
└──────────────┬──────────────────────────────────────────────┘
               │
               │ userId disponível em request.user
               ▼
┌─────────────────────────────────────────────────────────────┐
│                    Controller                                │
│  - Acessa userId via @CurrentUserId() decorator             │
│  - Executa lógica de negócio                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Componentes do Sistema

### 1. **AuthModule** (`auth.module.ts`)

Módulo principal que configura toda a autenticação:

```typescript
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    PrismaService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
```

**Configurações importantes:**
- JWT expira em 30 dias
- Secret vem de variável de ambiente
- Integra Passport com estratégias Local e JWT

### 2. **AuthController** (`auth.controller.ts`)

Endpoints de autenticação:

#### **POST /auth/login**
```typescript
@isPublic()  // Rota pública (não requer autenticação)
@Post('login')
@UseGuards(LocalAuthGuard)  // Valida credenciais
async login(
  @CurrentUserId() userId: number,
  @Res({ passthrough: true }) res: Response,
) {
  const { user, access_token } = await this.authService.login(userId);
  
  // Define cookie HTTP-only
  res.cookie('session', access_token, {
    httpOnly: true,      // JavaScript não pode acessar
    secure: true,        // Apenas HTTPS (produção)
    sameSite: 'none',    // Permite cross-origin
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
  });
  
  return { user };
}
```

#### **POST /auth/logout**
```typescript
@isPublic()
@Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
  res.clearCookie('session', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    path: '/',
  });
  
  return { message: 'Logout successful' };
}
```

### 3. **AuthService** (`auth.service.ts`)

Lógica de autenticação:

```typescript
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  // Gera JWT e retorna dados do usuário
  async login(userId: number) {
    const user = await this.userRepository.findById(userId);

    const payload = {
      sub: user.id,
      username: user.username,
    } as PayloadDto;

    const token = this.jwtService.sign(payload);
    const userDto = UserMapper.toDto(user);

    return {
      user: userDto,
      access_token: token,
    };
  }

  // Valida credenciais
  async validate(loginDto: LoginDto): Promise<number> {
    const { username, password } = loginDto;
    const user = await this.userRepository.findByUsername(username);

    if (user && password === user.password) {
      return user.id;
    }
  }
}
```

**⚠️ IMPORTANTE:** O sistema atual armazena senhas em texto plano (`password === user.password`). Isso é uma **vulnerabilidade de segurança grave** e deve ser corrigido usando bcrypt ou similar.

### 4. **LocalStrategy** (`local.strategy.ts`)

Estratégia para validação de credenciais no login:

```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();  // Usa campos padrão: username e password
  }

  async validate(username: string, password: string): Promise<number> {
    const userId = await this.authService.validate({
      username,
      password,
    } as LoginDto);

    return userId;  // Disponível em request.user
  }
}
```

### 5. **JwtStrategy** (`jwt.strategy.ts`)

Estratégia para validação de JWT em requisições protegidas:

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Extrai JWT do cookie "session"
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.session;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadDto): Promise<number> {
    return payload.sub;  // Retorna userId
  }
}
```

### 6. **JwtAuthGuard** (`jwt-auth.guard.ts`)

Guard global que protege todas as rotas:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    // Verifica se a rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;  // Permite acesso sem autenticação
    }

    // Valida JWT
    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    return (canActivate as Promise<boolean>).catch(() => {
      throw new UnauthorizedException();
    });
  }
}
```

**Configurado como guard global em `app.module.ts`:**
```typescript
providers: [
  {
    provide: APP_GUARD,
    useClass: JwtAuthGuard,
  },
]
```

### 7. **Decorators Customizados**

#### **@isPublic()**
Marca rotas como públicas (não requerem autenticação):

```typescript
export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
```

Uso:
```typescript
@isPublic()
@Post('login')
async login() { ... }
```

#### **@CurrentUserId()**
Extrai o ID do usuário autenticado da requisição:

```typescript
export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user;  // userId injetado pelo JwtStrategy
  },
);
```

Uso:
```typescript
@Get('profile')
async getProfile(@CurrentUserId() userId: number) {
  // userId do usuário autenticado
}
```

### 8. **Modelo de Usuário** (Prisma)

```prisma
model User {
  id       Int    @id @default(autoincrement())
  name     String
  username String @unique
  password String
  role     String @default("SELLER") // ADMINISTRATOR | SELLER

  Order Order[]

  @@map("users")
}
```

**Roles disponíveis:**
```typescript
export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  SELLER = 'SELLER',
}
```

---

## 🔄 Fluxo de Autenticação

### Fluxo Completo de Login

1. **Cliente envia credenciais:**
   ```http
   POST /auth/login
   Content-Type: application/json
   
   {
     "username": "admin",
     "password": "123"
   }
   ```

2. **LocalAuthGuard intercepta:**
   - Extrai username e password do body
   - Passa para LocalStrategy

3. **LocalStrategy valida:**
   - Chama `authService.validate()`
   - Busca usuário no banco
   - Compara senha
   - Retorna userId se válido

4. **AuthController processa:**
   - Recebe userId do guard
   - Chama `authService.login(userId)`
   - Gera JWT
   - Define cookie HTTP-only

5. **Cliente recebe resposta:**
   ```http
   HTTP/1.1 200 OK
   Set-Cookie: session=eyJhbGc...; HttpOnly; Secure; SameSite=None
   
   {
     "user": {
       "id": 1,
       "name": "Administrador",
       "username": "admin",
       "role": "ADMINISTRATOR"
     }
   }
   ```

### Fluxo de Requisição Protegida

1. **Cliente faz requisição:**
   ```http
   GET /products
   Cookie: session=eyJhbGc...
   ```

2. **JwtAuthGuard intercepta:**
   - Verifica se rota tem @isPublic()
   - Se não, valida JWT

3. **JwtStrategy valida:**
   - Extrai JWT do cookie
   - Verifica assinatura
   - Verifica expiração
   - Retorna userId do payload

4. **Controller executa:**
   - userId disponível via @CurrentUserId()
   - Executa lógica de negócio

5. **Cliente recebe resposta:**
   ```http
   HTTP/1.1 200 OK
   
   [
     { "id": 1, "name": "Produto 1", ... }
   ]
   ```

### Fluxo de Logout

1. **Cliente solicita logout:**
   ```http
   POST /auth/logout
   Cookie: session=eyJhbGc...
   ```

2. **AuthController processa:**
   - Limpa cookie "session"

3. **Cliente recebe resposta:**
   ```http
   HTTP/1.1 200 OK
   Set-Cookie: session=; Max-Age=0
   
   {
     "message": "Logout successful"
   }
   ```

---

## 🚀 Implementação do Zero

Aqui está um guia passo a passo para implementar autenticação JWT em um novo sistema NestJS.

### Passo 1: Instalar Dependências

```bash
npm install @nestjs/passport @nestjs/jwt passport passport-local passport-jwt
npm install -D @types/passport-local @types/passport-jwt
npm install bcrypt cookie-parser
npm install -D @types/bcrypt @types/cookie-parser
```

### Passo 2: Configurar Variáveis de Ambiente

Crie arquivo `.env`:
```env
JWT_SECRET=sua-chave-secreta-super-forte-aqui
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### Passo 3: Criar Schema do Banco (Prisma)

```prisma
// prisma/schema.prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   // Hash bcrypt
  role      String   @default("USER")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}
```

Execute:
```bash
npx prisma migrate dev --name create_users
npx prisma generate
```

### Passo 4: Criar DTOs

```typescript
// src/modules/auth/dtos/login.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
```

```typescript
// src/modules/auth/dtos/payload.dto.ts
export class PayloadDto {
  sub: number;      // userId
  email: string;
  role: string;
}
```

```typescript
// src/modules/auth/dtos/register.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;
}
```

### Passo 5: Criar UserRepository

```typescript
// src/modules/user/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@src/common/services/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }
}
```

### Passo 6: Criar AuthService

```typescript
// src/modules/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRepository } from '@src/modules/user/repositories/user.repository';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { PayloadDto } from '../dtos/payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    // Verifica se usuário já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async validateUser(loginDto: LoginDto): Promise<number> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Compara senha com hash
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user.id;
  }

  async login(userId: number) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const payload: PayloadDto = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access_token: token,
    };
  }
}
```

### Passo 7: Criar Estratégias (Strategies)

```typescript
// src/modules/auth/strategies/local.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',  // Usa email ao invés de username
    });
  }

  async validate(email: string, password: string): Promise<number> {
    const userId = await this.authService.validateUser({ email, password });
    return userId;
  }
}
```

```typescript
// src/modules/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { PayloadDto } from '../dtos/payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.session;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: PayloadDto): Promise<number> {
    return payload.sub;  // Retorna userId
  }
}
```

### Passo 8: Criar Guards

```typescript
// src/modules/auth/guards/local-auth.guard.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new UnauthorizedException(err?.message || 'Invalid credentials');
    }
    return user;
  }
}
```

```typescript
// src/modules/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '@src/common/decorators/is-public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean {
    // Verifica se rota é pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    return (canActivate as Promise<boolean>).catch(() => {
      throw new UnauthorizedException();
    });
  }
}
```

### Passo 9: Criar Decorators

```typescript
// src/common/decorators/is-public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
```

```typescript
// src/common/decorators/current-user-id.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
```

### Passo 10: Criar AuthController

```typescript
// src/modules/auth/controllers/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { isPublic } from '@src/common/decorators/is-public.decorator';
import { CurrentUserId } from '@src/common/decorators/current-user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @isPublic()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @isPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUserId() userId: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, access_token } = await this.authService.login(userId);

    res.cookie('session', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 dias
    });

    return { user };
  }

  @isPublic()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('session', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logout successful' };
  }

  @Post('me')
  async getCurrentUser(@CurrentUserId() userId: number) {
    // Retorna dados do usuário autenticado
    return { userId };
  }
}
```

### Passo 11: Criar AuthModule

```typescript
// src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from '../user/repositories/user.repository';
import { PrismaService } from '@src/common/services/prisma.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UserRepository,
    PrismaService,
  ],
})
export class AuthModule {}
```

### Passo 12: Configurar AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

### Passo 13: Configurar main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  await app.listen(3001);
}

bootstrap();
```

### Passo 14: Criar Seed para Usuário Inicial

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Creating admin user...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMINISTRATOR',
    },
  });

  console.log('Seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Execute:
```bash
npx prisma db seed
```

### Passo 15: Testar o Sistema

```bash
# Iniciar servidor
npm run start:dev

# Testar registro
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "123456"
  }'

# Testar login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }' \
  -c cookies.txt

# Testar rota protegida
curl -X POST http://localhost:3001/auth/me \
  -b cookies.txt

# Testar logout
curl -X POST http://localhost:3001/auth/logout \
  -b cookies.txt
```

---

## 👥 Sistema com Múltiplos Tipos de Usuários

Para implementar um sistema com diferentes tipos de usuários (roles), precisamos adicionar controle de acesso baseado em papéis (RBAC - Role-Based Access Control).

### Estrutura de Roles

```typescript
// src/common/enums/role.enum.ts
export enum Role {
  ADMINISTRATOR = 'ADMINISTRATOR',
  MANAGER = 'MANAGER',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER',
}
```

### Guard de Roles

```typescript
// src/modules/auth/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@src/common/enums/role.enum';
import { ROLES_KEY } from '@src/common/decorators/roles.decorator';
import { UserRepository } from '@src/modules/user/repositories/user.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user;

    if (!userId) {
      return false;
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
```

### Decorator de Roles

```typescript
// src/common/decorators/roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
```

### Configurar RolesGuard no AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/auth/guards/roles.guard';
import { UserRepository } from './modules/user/repositories/user.repository';
import { PrismaService } from './common/services/prisma.service';

@Module({
  imports: [AuthModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    UserRepository,
    PrismaService,
  ],
})
export class AppModule {}
```

### Usar Roles nos Controllers

```typescript
// src/modules/product/controllers/product.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { Roles } from '@src/common/decorators/roles.decorator';
import { Role } from '@src/common/enums/role.enum';
import { ProductService } from '../services/product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // Qualquer usuário autenticado pode listar produtos
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  // Apenas ADMINISTRATOR e MANAGER podem criar produtos
  @Post()
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  create(@Body() createProductDto: any) {
    return this.productService.create(createProductDto);
  }

  // Apenas ADMINISTRATOR pode deletar produtos
  @Delete(':id')
  @Roles(Role.ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
```

### Exemplo de Sistema com 4 Tipos de Usuários

#### 1. **ADMINISTRATOR**
- Acesso total ao sistema
- Pode gerenciar usuários
- Pode modificar configurações

```typescript
@Post('users')
@Roles(Role.ADMINISTRATOR)
createUser(@Body() createUserDto: CreateUserDto) {
  return this.userService.create(createUserDto);
}
```

#### 2. **MANAGER**
- Pode gerenciar produtos e pedidos
- Pode ver relatórios
- Não pode gerenciar usuários

```typescript
@Get('reports')
@Roles(Role.ADMINISTRATOR, Role.MANAGER)
getReports() {
  return this.reportService.getAll();
}
```

#### 3. **SELLER**
- Pode criar pedidos
- Pode ver produtos
- Não pode modificar preços

```typescript
@Post('orders')
@Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.SELLER)
createOrder(@Body() createOrderDto: CreateOrderDto) {
  return this.orderService.create(createOrderDto);
}
```

#### 4. **CUSTOMER**
- Pode ver seus próprios pedidos
- Pode atualizar seu perfil
- Não pode acessar área administrativa

```typescript
@Get('my-orders')
@Roles(Role.CUSTOMER)
getMyOrders(@CurrentUserId() userId: number) {
  return this.orderService.findByCustomer(userId);
}
```

### Decorator para Usuário Completo

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRepository } from '@src/modules/user/repositories/user.repository';

export const CurrentUser = createParamDecorator(
  async (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const userId = request.user;

    if (!userId) {
      return null;
    }

    const userRepository = new UserRepository(/* inject PrismaService */);
    return userRepository.findById(userId);
  },
);
```

Uso:
```typescript
@Get('profile')
async getProfile(@CurrentUser() user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
```

### Controle de Acesso por Propriedade

Para permitir que usuários acessem apenas seus próprios recursos:

```typescript
// src/modules/order/guards/order-ownership.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';

@Injectable()
export class OrderOwnershipGuard implements CanActivate {
  constructor(private orderRepository: OrderRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user;
    const orderId = +request.params.id;

    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new ForbiddenException('Order not found');
    }

    // Verifica se o pedido pertence ao usuário
    if (order.customerId !== userId) {
      throw new ForbiddenException('You can only access your own orders');
    }

    return true;
  }
}
```

Uso:
```typescript
@Get('orders/:id')
@UseGuards(OrderOwnershipGuard)
@Roles(Role.CUSTOMER)
getOrder(@Param('id') id: string) {
  return this.orderService.findOne(+id);
}
```

---

## 🔒 Segurança e Boas Práticas

### 1. **Hash de Senhas com bcrypt**

**NUNCA armazene senhas em texto plano!**

```typescript
import * as bcrypt from 'bcrypt';

// Ao criar usuário
const hashedPassword = await bcrypt.hash(password, 10);

// Ao validar login
const isValid = await bcrypt.compare(password, user.password);
```

### 2. **Variáveis de Ambiente Seguras**

```env
# NÃO commitar este arquivo!
JWT_SECRET=chave-super-secreta-aleatoria-longa-aqui
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

Gere secrets fortes:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. **Cookies Seguros**

```typescript
res.cookie('session', token, {
  httpOnly: true,           // Previne acesso via JavaScript
  secure: true,             // Apenas HTTPS (produção)
  sameSite: 'strict',       // Protege contra CSRF
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30,
});
```

### 4. **CORS Restritivo**

```typescript
app.enableCors({
  origin: ['https://meudominio.com'],  // Apenas domínios permitidos
  credentials: true,
});
```

### 5. **Rate Limiting**

Instale:
```bash
npm install @nestjs/throttler
```

Configure:
```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,      // Tempo em segundos
      limit: 10,    // Máximo de requisições
    }),
  ],
})
```

Proteja endpoint de login:
```typescript
import { Throttle } from '@nestjs/throttler';

@Throttle(5, 60)  // 5 tentativas por minuto
@Post('login')
async login() { ... }
```

### 6. **Validação de Dados**

```typescript
import { IsEmail, IsStrongPassword, Length } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
```

### 7. **Refresh Tokens**

Para melhorar segurança, implemente refresh tokens:

```typescript
// Payload do access token (curta duração)
const accessTokenPayload = { sub: userId, type: 'access' };
const accessToken = this.jwtService.sign(accessTokenPayload, {
  expiresIn: '15m',
});

// Payload do refresh token (longa duração)
const refreshTokenPayload = { sub: userId, type: 'refresh' };
const refreshToken = this.jwtService.sign(refreshTokenPayload, {
  expiresIn: '30d',
});
```

### 8. **Auditoria e Logs**

```typescript
@Post('login')
async login(@CurrentUserId() userId: number, @Req() req: Request) {
  const { user, access_token } = await this.authService.login(userId);
  
  // Log de auditoria
  this.logger.log({
    action: 'LOGIN',
    userId: user.id,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    timestamp: new Date(),
  });
  
  return { user };
}
```

### 9. **Timeout de Sessão**

```typescript
// JwtStrategy
constructor() {
  super({
    jwtFromRequest: ExtractJwt.fromExtractors([...]),
    ignoreExpiration: false,  // NUNCA ignore expiração
    secretOrKey: process.env.JWT_SECRET,
  });
}
```

### 10. **Proteção contra Ataques**

- **SQL Injection**: Use Prisma/ORM (evita SQL direto)
- **XSS**: Cookies httpOnly, sanitize inputs
- **CSRF**: SameSite cookies, CSRF tokens
- **Brute Force**: Rate limiting, captcha
- **Session Fixation**: Regenere token após login

---

## 📝 Checklist de Implementação

- [ ] Instalar dependências necessárias
- [ ] Configurar variáveis de ambiente
- [ ] Criar schema do banco com modelo User
- [ ] Implementar hash de senhas com bcrypt
- [ ] Criar DTOs de autenticação
- [ ] Implementar UserRepository
- [ ] Implementar AuthService com validação segura
- [ ] Criar LocalStrategy para login
- [ ] Criar JwtStrategy para validação de token
- [ ] Criar Guards (LocalAuthGuard, JwtAuthGuard)
- [ ] Criar Decorators (@isPublic, @CurrentUserId)
- [ ] Criar AuthController com endpoints
- [ ] Configurar AuthModule
- [ ] Configurar guard global no AppModule
- [ ] Configurar cookies no main.ts
- [ ] Criar seed para usuário inicial
- [ ] Implementar sistema de roles (se necessário)
- [ ] Criar RolesGuard e decorator @Roles
- [ ] Adicionar rate limiting
- [ ] Testar todos os endpoints
- [ ] Documentar API com Swagger
- [ ] Implementar testes automatizados

---

## 🎓 Conclusão

Este guia fornece uma implementação completa e segura de autenticação JWT em NestJS com:

1. ✅ Autenticação baseada em JWT
2. ✅ Cookies HTTP-only para sessões
3. ✅ Hash de senhas com bcrypt
4. ✅ Suporte a múltiplos tipos de usuários (roles)
5. ✅ Guards globais e decorators customizados
6. ✅ Boas práticas de segurança

O sistema Constrular serve como excelente referência, mas lembre-se de sempre:
- Usar bcrypt para hash de senhas
- Proteger variáveis de ambiente
- Implementar rate limiting
- Validar todos os inputs
- Manter logs de auditoria
- Testar extensivamente

---

## 📚 Recursos Adicionais

- [NestJS Authentication](https://docs.nestjs.com/security/authentication)
- [Passport.js](http://www.passportjs.org/)
- [JWT.io](https://jwt.io/)
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

---

**Última atualização:** Novembro 2025
