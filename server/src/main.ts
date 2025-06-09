import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { execSync } from 'child_process';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades não definidas forem enviadas
      transform: true, // Transforma o payload em uma instância do DTO
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter(app.get(HttpAdapterHost)));
  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Soficit API')
    .setDescription(
      'Essa catálogo de métodos de API tem como objetivo documentar todos os endpoints do backend do Constrular System',
    )
    .setVersion('1.0')
    .addTag('Constrular System')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  try {
    Logger.log('Attempting to apply Prisma migrations...', 'Prisma');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    Logger.log(
      'Prisma migrations applied successfully (or were already up-to-date).',
      'Prisma',
    );
  } catch (error) {
    Logger.error(
      'Failed to apply Prisma migrations. Application will exit.',
      error.stderr?.toString() || error.message,
      'Prisma',
    );
    process.exit(1); // Encerra o processo com código de erro
    // Decide if you want the application to fail to start if migrations fail.
    // For "sem quebrar", we log the error and continue, but the app might not work correctly.
    // To make it a hard stop, you could re-throw the error or process.exit(1).
    // Logger.warn('Application will continue to start, but database schema might be out of sync.', 'Prisma');
  }

  await app.listen(process.env.BACKEND_PORT);
}

bootstrap().then(
  () => {
    Logger.log(
      `Server is running in http://localhost:${process.env.BACKEND_PORT}/`,
    );
    Logger.log(
      `Swagger is running in http://localhost:${process.env.BACKEND_PORT}/docs`,
    );
  },
  (err) => Logger.error(err),
);
