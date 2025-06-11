import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { execSync } from 'child_process';

dotenv.config();
const backendPort = process.env.BACKEND_PORT ?? 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
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
    process.exit(1);
  }

  await app.listen(backendPort);
}

bootstrap().then(
  () => {
    Logger.log(`Server is running in http://localhost:${backendPort}/`);
    Logger.log(`Swagger is running in http://localhost:${backendPort}/docs`);
  },
  (err) => Logger.error(err),
);
